import { computedStore } from "../../store/computed.store.js";

export function buildDemand(selectedDays = 45) {

  const master = computedStore.master;
  if (!master) return;

  const rows = [];

  Object.values(master.styles).forEach(style => {

    const styleDRR = style.drr;
    const styleStock = style.totalStock;
    const styleProduction = style.totalProduction || 0;

    const styleRequired = styleDRR * selectedDays;

    let styleDirect = styleRequired - styleStock;
    if (styleDirect < 0) styleDirect = 0;

    let stylePending = styleDirect - styleProduction;
    if (stylePending < 0) stylePending = 0;

    // Build SKU rows
    const skuRows = Object.values(style.skus).map(sku => {

      const skuDRR = sku.drr;
      const skuStock = sku.totalStock;
      const skuProduction = sku.production || 0;

      const skuRequired = skuDRR * selectedDays;

      let skuDirect = skuRequired - skuStock;
      if (skuDirect < 0) skuDirect = 0;

      let skuPending = skuDirect - skuProduction;
      if (skuPending < 0) skuPending = 0;

      return {
        sku: sku.sku,
        totalSales: sku.totalSales,
        totalStock: skuStock,
        drr: skuDRR,
        sc: skuDRR > 0 ? skuStock / skuDRR : 0,
        requiredDemand: skuRequired,
        directDemand: skuDirect,
        production: skuProduction,
        pending: skuPending
      };
    });

    rows.push({
      styleId: style.styleId,
      category: style.category,
      remark: style.remark,
      totalSales: style.totalSales,
      totalStock: styleStock,
      drr: styleDRR,
      sc: styleDRR > 0 ? styleStock / styleDRR : 0,
      requiredDemand: styleRequired,
      directDemand: styleDirect,
      production: styleProduction,
      pending: stylePending,
      skus: skuRows
    });
  });

  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = {
    rows,
    selectedDays
  };
}
