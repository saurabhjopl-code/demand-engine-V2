import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

export function buildBroken() {

  const master = computedStore.master;
  if (!master) return;

  const rows = [];

  Object.values(master.styles).forEach(style => {

    const sizeData = {};
    let brokenCount = 0;
    let healthyCount = 0;

    // Build size stock map
    Object.values(style.skus).forEach(sku => {

      Object.entries(sku.sizes).forEach(([size, data]) => {

        if (!sizeData[size]) {
          sizeData[size] = {
            sales: 0,
            stock: 0
          };
        }

        sizeData[size].sales += data.totalUnits || 0;
        sizeData[size].stock += data.stock || 0;
      });

    });

    // Evaluate sizes
    SIZE_ORDER.forEach(size => {

      const stock = sizeData[size]?.stock || 0;

      if (stock <= 5) {
        if (stock > 0 || stock === 0) {
          brokenCount++;
        }
      }

      if (stock > 5) {
        healthyCount++;
      }
    });

    // Style is broken only if mix exists
    if (brokenCount > 0 && healthyCount > 0) {

      rows.push({
        styleId: style.styleId,
        category: style.category,
        remark: style.remark,
        totalSales: style.totalSales,
        totalStock: style.totalStock,
        brokenCount,
        healthyCount,
        sizes: sizeData
      });
    }

  });

  // Sort by Total Sales High → Low
  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports.broken = { rows };
}
