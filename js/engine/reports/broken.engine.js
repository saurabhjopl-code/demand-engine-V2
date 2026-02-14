// js/engine/reports/broken.engine.js

import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";
import { SIZE_SEQUENCE } from "../../config/constants.js";

export function buildBroken() {

  const result = [];

  const master = computedStore.master?.styles || {};
  const stockRaw = dataStore.stock || [];
  const sizeCountSheet = dataStore.sizeCount || [];

  // Build SELLER stock map
  const sellerMap = {};

  stockRaw.forEach(row => {

    if (row["FC"] !== "SELLER") return;

    const styleId = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!sellerMap[styleId]) {
      sellerMap[styleId] = {};
    }

    if (!sellerMap[styleId][size]) {
      sellerMap[styleId][size] = 0;
    }

    sellerMap[styleId][size] += units;
  });

  // Evaluate styles
  for (const styleId in sellerMap) {

    const styleSellerSizes = sellerMap[styleId];
    const styleMaster = master[styleId];

    if (!styleMaster) continue;

    let brokenSizes = [];
    let sellerTotalStock = 0;

    SIZE_SEQUENCE.forEach(size => {

      const sellerStock = Number(styleSellerSizes[size] || 0);

      sellerTotalStock += sellerStock;

      // 0–5 = broken
      if (sellerStock <= 5) {
        brokenSizes.push(size);
      }
    });

    const brokenCount = brokenSizes.length;

    if (brokenCount === 0) continue;

    const sizeCountRow = sizeCountSheet.find(
      r => r["Style ID"] === styleId
    );

    const totalSizes = sizeCountRow
      ? Number(sizeCountRow["Size Count"])
      : 0;

    const drr = Number(styleMaster.drr || 0);
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
      totalSale: styleMaster.totalSales || 0,
      totalStock: sellerTotalStock,
      drr,
      sc,
      remark
    });
  }

  // Sort by Total Sale DESC
  result.sort((a, b) => b.totalSale - a.totalSale);

  computedStore.reports.broken = result;
}
