import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

export function buildOverstock(threshold = 90) {

  const master = computedStore.master;
  if (!master) return;

  const rows = [];

  Object.values(master.styles).forEach(style => {

    const drr = style.drr;
    const stock = style.totalStock;
    const sc = drr > 0 ? stock / drr : 0;

    if (sc <= threshold) return;

    const excessUnits = stock - (drr * threshold);

    const skuRows = Object.values(style.skus)
      .sort((a, b) => {
        const sizeA = Object.keys(a.sizes)[0] || "";
        const sizeB = Object.keys(b.sizes)[0] || "";
        return SIZE_ORDER.indexOf(sizeA) - SIZE_ORDER.indexOf(sizeB);
      })
      .map(sku => {

        const skuDRR = sku.drr;
        const skuStock = sku.totalStock;
        const skuSC = skuDRR > 0 ? skuStock / skuDRR : 0;

        if (skuSC <= threshold) return null;

        const skuExcess = skuStock - (skuDRR * threshold);

        return {
          sku: sku.sku,
          totalSales: sku.totalSales,
          stock: skuStock,
          drr: skuDRR,
          sc: skuSC,
          excessUnits: skuExcess
        };
      })
      .filter(Boolean);

    rows.push({
      styleId: style.styleId,
      category: style.category,
      remark: style.remark,
      totalSales: style.totalSales,
      stock,
      drr,
      sc,
      excessUnits,
      skus: skuRows
    });
  });

  rows.sort((a, b) => b.sc - a.sc);

  computedStore.reports.overstock = {
    rows,
    threshold
  };
}
