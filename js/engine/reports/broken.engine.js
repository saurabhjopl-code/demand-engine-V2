import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";
import { SIZE_SEQUENCE } from "../../config/constants.js";

export function buildBroken() {

  const result = [];

  const master = computedStore.master?.styles || {};
  const stockRaw = dataStore.stock || [];
  const sizeCountSheet = dataStore.sizeCount || [];

  // STEP 1 — Build SELLER stock map (all sizes with units)
  const sellerStockMap = {};

  stockRaw.forEach(row => {

    if (row["FC"] !== "SELLER") return;

    const styleId = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!SIZE_SEQUENCE.includes(size)) return;

    if (!sellerStockMap[styleId]) {
      sellerStockMap[styleId] = {};
    }

    sellerStockMap[styleId][size] = units;
  });

  // STEP 2 — Evaluate styles
  for (const styleId in master) {

    const styleMaster = master[styleId];
    const styleStock = sellerStockMap[styleId] || {};

    const sizeCountRow = sizeCountSheet.find(
      r => r["Style ID"] === styleId
    );

    if (!sizeCountRow) continue;

    const totalSizes = Number(sizeCountRow["Size Count"] || 0);
    if (totalSizes === 0) continue;

    let brokenSizes = [];

    Object.entries(styleStock).forEach(([size, units]) => {

      if (units <= 5) {
        brokenSizes.push(size);
      }
    });

    const brokenCount = brokenSizes.length;

    if (brokenCount === 0) continue;

    // SELLER total stock
    const sellerTotalStock = Object.values(styleStock)
      .reduce((sum, units) => sum + Number(units || 0), 0);

    const drr = Number(styleMaster.drr || 0);
    const sc = drr > 0 ? sellerTotalStock / drr : 0;

    // Remark logic
    let remark = "Good";

    if (brokenCount > 5) {
      remark = "Critical";
    } else if (brokenCount > 2) {
      remark = "Warning";
    }

    // Sort broken sizes in correct size order
    brokenSizes.sort(
      (a, b) => SIZE_SEQUENCE.indexOf(a) - SIZE_SEQUENCE.indexOf(b)
    );

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
