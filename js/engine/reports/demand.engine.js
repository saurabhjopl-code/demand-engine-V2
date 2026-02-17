import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function getTotalSaleDays() {
  return dataStore.saleDays.reduce(
    (sum, r) => sum + Number(r.Days || 0),
    0
  );
}

function getSkuSize(styleId, sku) {
  const row = dataStore.sales.find(
    r => r["Style ID"] === styleId &&
         r["Uniware SKU"] === sku
  );
  return row?.Size || "FS";
}

function getStockByMode(styleId, stockMode) {

  const rows = dataStore.stock.filter(r => r["Style ID"] === styleId);

  if (stockMode === "seller") {
    return rows
      .filter(r => r.FC === "SELLER")
      .reduce((sum, r) => sum + Number(r.Units || 0), 0);
  }

  return rows.reduce((sum, r) => sum + Number(r.Units || 0), 0);
}

function getSkuStockByMode(styleId, sku, stockMode) {

  const rows = dataStore.stock.filter(
    r => r["Style ID"] === styleId &&
         r["Uniware SKU"] === sku
  );

  if (stockMode === "seller") {
    return rows
      .filter(r => r.FC === "SELLER")
      .reduce((sum, r) => sum + Number(r.Units || 0), 0);
  }

  return rows.reduce((sum, r) => sum + Number(r.Units || 0), 0);
}

function getStyleMeta(styleId) {
  const row = dataStore.styleStatus.find(
    r => r["Style ID"] === styleId
  );

  return {
    category: row?.Category || "",
    remark: row?.["Company Remark"] || ""
  };
}

export function buildDemand(scDays = 45, stockMode = "total") {

  const sales = dataStore.sales;
  const totalSaleDays = getTotalSaleDays();

  const styleMap = {};

  sales.forEach(row => {

    const style = row["Style ID"];
    const sku = row["Uniware SKU"];
    const units = Number(row.Units || 0);

    if (!styleMap[style]) {
      styleMap[style] = {
        totalSales: 0,
        skus: {}
      };
    }

    styleMap[style].totalSales += units;

    if (!styleMap[style].skus[sku]) {
      styleMap[style].skus[sku] = 0;
    }

    styleMap[style].skus[sku] += units;
  });

  const rows = [];

  Object.entries(styleMap).forEach(([styleId, data]) => {

    const meta = getStyleMeta(styleId);

    const totalSales = data.totalSales;
    const totalStock = getStockByMode(styleId, stockMode);

    const drr = totalSaleDays > 0
      ? totalSales / totalSaleDays
      : 0;

    const requiredDemand = drr * scDays;
    const directDemand = Math.max(requiredDemand - totalStock, 0);

    const productionRows = dataStore.production.filter(
      r => r["Uniware SKU"] &&
           r["Uniware SKU"].includes(styleId)
    );

    const production = productionRows.reduce(
      (sum, r) => sum + Number(r["In Production"] || 0), 0
    );

    const pending = Math.max(directDemand - production, 0);
    const sc = drr > 0 ? totalStock / drr : 0;

    const skuRows = [];

    Object.entries(data.skus).forEach(([sku, skuSales]) => {

      const size = getSkuSize(styleId, sku);
      const sizeIndex = SIZE_ORDER.indexOf(size);

      const skuStock = getSkuStockByMode(styleId, sku, stockMode);
      const skuDrr = totalSaleDays > 0
        ? skuSales / totalSaleDays
        : 0;

      const skuRequired = skuDrr * scDays;
      const skuDirect = Math.max(skuRequired - skuStock, 0);

      const skuProdRow = dataStore.production.find(
        r => r["Uniware SKU"] === sku
      );

      const skuProduction = skuProdRow
        ? Number(skuProdRow["In Production"] || 0)
        : 0;

      const skuPending = Math.max(skuDirect - skuProduction, 0);
      const skuSc = skuDrr > 0 ? skuStock / skuDrr : 0;

      skuRows.push({
        sku,
        size,
        sizeIndex: sizeIndex === -1 ? 0 : sizeIndex,
        totalSales: skuSales,
        totalStock: skuStock,
        drr: skuDrr,
        sc: skuSc,
        requiredDemand: skuRequired,
        directDemand: skuDirect,
        production: skuProduction,
        pending: skuPending
      });
    });

    // 🔥 SORT BY SIZE ORDER
    skuRows.sort((a, b) => a.sizeIndex - b.sizeIndex);

    rows.push({
      styleId,
      category: meta.category,
      remark: meta.remark,
      totalSales,
      totalStock,
      drr,
      sc,
      requiredDemand,
      directDemand,
      production,
      pending,
      skus: skuRows
    });
  });

  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = {
    rows,
    selectedDays: scDays,
    stockMode
  };
}
