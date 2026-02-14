import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

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

    // 🔥 Build & Sort SKU Rows by Size Order
    const skuRows = Object.values(style.skus)
      .sort((a, b) => {

        const sizeA = Object.keys(a.sizes)[0] || "";
        const sizeB = Object.keys(b.sizes)[0] || "";

        return SIZE_ORDER.indexOf(sizeA) - SIZE_ORDER.indexOf(sizeB);
      })
      .map(sku => {

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

  // Sort Styles by Total Sales (High → Low)
  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = {
    rows,
    selectedDays
  };
}
