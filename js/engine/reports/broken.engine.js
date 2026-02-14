import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";
import { SIZE_SEQUENCE } from "../../config/constants.js";

export function buildBroken() {

  const result = [];

  const master = computedStore.master?.styles || {};
  const stockRaw = dataStore.stock || [];
  const sizeCountSheet = dataStore.sizeCount || [];

  // STEP 1: Build SELLER stock map (only >5 stock)
  const sellerAvailable = {};

  stockRaw.forEach(row => {

    if (row["FC"] !== "SELLER") return;

    const styleId = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!SIZE_SEQUENCE.includes(size)) return; // Ignore FC, random text

    if (units > 5) {

      if (!sellerAvailable[styleId]) {
        sellerAvailable[styleId] = new Set();
      }

      sellerAvailable[styleId].add(size);
    }
  });

  // STEP 2: Evaluate styles
  for (const styleId in master) {

    const styleMaster = master[styleId];
    const availableSizes = sellerAvailable[styleId] || new Set();

    const sizeCountRow = sizeCountSheet.find(
      r => r["Style ID"] === styleId
    );

    if (!sizeCountRow) continue;

    const totalSizes = Number(sizeCountRow["Size Count"] || 0);

    if (totalSizes === 0) continue;

    const availableCount = availableSizes.size;

    const brokenCount = totalSizes - availableCount;

    if (brokenCount <= 0) continue;

    // Build broken size list
    const brokenSizes = SIZE_SEQUENCE.filter(size => {

      if (!availableSizes.has(size)) {

        // Only count sizes that actually belong to style
        // Avoid FS style mismatch
        if (totalSizes === 1 && SIZE_SEQUENCE.includes("FS")) {
          return size === "FS";
        }

        return true;
      }

      return false;
    });

    // SELLER total stock
    const sellerTotalStock = stockRaw
      .filter(r =>
        r["FC"] === "SELLER" &&
        r["Style ID"] === styleId
      )
      .reduce((sum, r) => sum + Number(r["Units"] || 0), 0);

    const drr = Number(styleMaster.drr || 0);
    const sc = drr > 0 ? sellerTotalStock / drr : 0;

    // Remark logic
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
