import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

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

  if (!row) {
    return { category: "", remark: "" };
  }

  return {
    category: row.Category || "",
    remark: row["Company Remark"] || ""
  };
}

export function buildOverstock(threshold = 90, stockMode = "total") {

  const sales = dataStore.sales;
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

    const drr = totalSales / 45; // keeping consistent with earlier logic
    const sc = drr > 0 ? totalStock / drr : 0;

    if (sc < threshold) return;

    const excessUnits = Math.max(totalStock - (drr * threshold), 0);

    const skuRows = [];

    Object.entries(data.skus).forEach(([sku, skuSales]) => {

      const skuStock = getSkuStockByMode(styleId, sku, stockMode);

      const skuDrr = skuSales / 45;
      const skuSc = skuDrr > 0 ? skuStock / skuDrr : 0;

      if (skuSc < threshold) return;

      const skuExcess = Math.max(skuStock - (skuDrr * threshold), 0);

      skuRows.push({
        sku,
        totalSales: skuSales,
        stock: skuStock,
        drr: skuDrr,
        sc: skuSc,
        excessUnits: skuExcess
      });
    });

    // 🔥 Sort SKU rows by sales DESC
    skuRows.sort((a, b) => b.totalSales - a.totalSales);

    rows.push({
      styleId,
      category: meta.category,
      remark: meta.remark,
      totalSales,
      stock: totalStock,
      drr,
      sc,
      excessUnits,
      skus: skuRows
    });
  });

  // 🔥 Sort Style rows by sales DESC
  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.overstock = {
    rows,
    threshold,
    stockMode
  };
}
