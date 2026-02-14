import { computedStore } from "../store/computed.store.js";

function createSheet(dataArray) {
  return XLSX.utils.json_to_sheet(dataArray);
}

function flattenDemand() {

  const data = computedStore.reports?.demand;
  if (!data) return [];

  const rows = [];

  data.rows.forEach(row => {

    rows.push({
      Type: "STYLE",
      Style: row.styleId,
      Category: row.category,
      Remark: row.remark,
      TotalSales: row.totalSales,
      Stock: row.totalStock,
      DRR: row.drr,
      SC: row.sc,
      Required: row.requiredDemand,
      Direct: row.directDemand,
      Production: row.production,
      Pending: row.pending
    });

    row.skus.forEach(sku => {
      rows.push({
        Type: "SKU",
        Style: row.styleId,
        SKU: sku.sku,
        TotalSales: sku.totalSales,
        Stock: sku.totalStock,
        DRR: sku.drr,
        SC: sku.sc,
        Required: sku.requiredDemand,
        Direct: sku.directDemand,
        Production: sku.production,
        Pending: sku.pending
      });
    });
  });

  return rows;
}

function flattenOverstock() {

  const data = computedStore.reports?.overstock;
  if (!data) return [];

  const rows = [];

  data.rows.forEach(row => {

    rows.push({
      Type: "STYLE",
      Style: row.styleId,
      Category: row.category,
      Remark: row.remark,
      TotalSales: row.totalSales,
      Stock: row.stock,
      DRR: row.drr,
      SC: row.sc,
      ExcessUnits: row.excessUnits
    });

    row.skus.forEach(sku => {
      rows.push({
        Type: "SKU",
        Style: row.styleId,
        SKU: sku.sku,
        TotalSales: sku.totalSales,
        Stock: sku.stock,
        DRR: sku.drr,
        SC: sku.sc,
        ExcessUnits: sku.excessUnits
      });
    });
  });

  return rows;
}

function flattenSizeCurve() {

  const data = computedStore.reports?.sizeCurve;
  if (!data) return [];

  return data.rows.map(row => ({
    Style: row.styleId,
    StyleDemand: row.styleDemand,
    ...row.sizes
  }));
}

function flattenBroken() {

  const data = computedStore.reports?.broken || [];

  return data.map(row => ({
    Style: row.styleId,
    TotalSizes: row.totalSizes,
    BrokenCount: row.brokenCount,
    BrokenSizes: row.brokenSizes,
    TotalSale: row.totalSale,
    TotalStock: row.totalStock,
    DRR: row.drr,
    SC: row.sc,
    Remark: row.remark
  }));
}

function flattenHero() {

  const data = computedStore.hero || [];
  if (!data.length) return [];

  const months = data[0].months;

  return data.map(row => ({
    Style: row.style,
    [`Sale_${months[0]}`]: row.sales[months[0]],
    [`Sale_${months[1]}`]: row.sales[months[1]],
    [`Sale_${months[2]}`]: row.sales[months[2]],
    [`Rank_${months[0]}`]: row.ranks[months[0]],
    [`Rank_${months[1]}`]: row.ranks[months[1]],
    [`Rank_${months[2]}`]: row.ranks[months[2]],
    [`DRR_${months[0]}`]: row.drr[months[0]],
    [`DRR_${months[1]}`]: row.drr[months[1]],
    [`DRR_${months[2]}`]: row.drr[months[2]],
    SC: row.sc,
    Broken: row.broken,
    Remark: row.remark
  }));
}

function flattenDW() {

  const data = computedStore.dw || [];
  if (!data.length) return [];

  const months = data[0].months;

  return data.map(row => ({
    Style: row.style,
    [`DW_${months[0]}`]: row.dw[months[0]],
    [`DW_${months[1]}`]: row.dw[months[1]],
    [`DW_${months[2]}`]: row.dw[months[2]],
    [`Sale_${months[0]}`]: row.sales[months[0]],
    [`Sale_${months[1]}`]: row.sales[months[1]],
    [`Sale_${months[2]}`]: row.sales[months[2]],
    Movement1: row.movement1,
    Movement2: row.movement2
  }));
}

export function exportAllReports() {

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, createSheet(flattenDemand()), "Demand");
  XLSX.utils.book_append_sheet(wb, createSheet(flattenOverstock()), "Overstock");
  XLSX.utils.book_append_sheet(wb, createSheet(flattenSizeCurve()), "SizeCurve");
  XLSX.utils.book_append_sheet(wb, createSheet(flattenBroken()), "Broken");
  XLSX.utils.book_append_sheet(wb, createSheet(flattenHero()), "Hero");
  XLSX.utils.book_append_sheet(wb, createSheet(flattenDW()), "DW");

  const today = new Date();
  const fileName = `Demand_Planning_Engine_${today.getFullYear()}${String(today.getMonth()+1).padStart(2,"0")}${String(today.getDate()).padStart(2,"0")}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
