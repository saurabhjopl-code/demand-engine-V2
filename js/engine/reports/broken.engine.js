// js/engine/reports/broken.engine.js

import { computedStore } from "../../store/computed.store.js";
import { SIZE_SEQUENCE } from "../../config/constants.js";

export function buildBroken() {

  const result = [];

  const master = computedStore.master?.styles || {};
  const sizeCountSheet = computedStore.raw?.sizeCount || [];

  for (const styleId in master) {

    const style = master[styleId];
    if (!style) continue;

    const totalSizesRow = sizeCountSheet.find(
      r => r["Style ID"] === styleId
    );

    const totalSizes = totalSizesRow
      ? Number(totalSizesRow["Size Count"])
      : 0;

    let brokenSizes = [];
    let sellerTotalStock = 0;

    for (const skuKey in style.skus) {

      const sku = style.skus[skuKey];
      if (!sku || !sku.sizes) continue;

      for (const size of SIZE_SEQUENCE) {

        const sizeData = sku.sizes[size];
        if (!sizeData) continue;

        const sellerStock = Number(sizeData.sellerStock || 0);

        sellerTotalStock += sellerStock;

        if (sellerStock <= 5) {
          if (!brokenSizes.includes(size)) {
            brokenSizes.push(size);
          }
        }
      }
    }

    const brokenCount = brokenSizes.length;

    if (brokenCount === 0) continue;

    const drr = Number(style.drr || 0);
    const sc = drr > 0 ? sellerTotalStock / drr : 0;

    let remark = "Good";

    if (brokenCount > 5) {
      remark = "Critical";
    } else if (brokenCount >= 3) {
      remark = "Warning";
    }

    result.push({
      styleId,
      totalSizes,
      brokenCount,
      brokenSizes: brokenSizes.join(", "),
      totalSale: style.totalSales || 0,
      totalStock: sellerTotalStock,
      drr,
      sc,
      remark
    });
  }

  result.sort((a, b) => b.totalSale - a.totalSale);

  computedStore.reports.broken = result;
}
