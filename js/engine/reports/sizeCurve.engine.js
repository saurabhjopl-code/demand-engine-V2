import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

export function buildSizeCurve(selectedDays = 45) {

  const master = computedStore.master;
  if (!master) return;

  const rows = [];

  Object.values(master.styles).forEach(style => {

    const totalSales = style.totalSales;
    const totalStock = style.totalStock;
    const drr = style.drr;

    const styleDemand = Math.max((drr * selectedDays) - totalStock, 0);

    const sizeAllocations = {};
    let allocatedTotal = 0;

    if (styleDemand > 0 && totalSales > 0) {

      // Build size weight map
      const sizeSalesMap = {};

      Object.values(style.skus).forEach(sku => {
        Object.entries(sku.sizes).forEach(([size, data]) => {
          sizeSalesMap[size] = (sizeSalesMap[size] || 0) + data.sales;
        });
      });

      // Allocation
      SIZE_ORDER.forEach(size => {

        const sizeSales = sizeSalesMap[size] || 0;
        const weight = totalSales > 0 ? sizeSales / totalSales : 0;

        const qty = Math.round(styleDemand * weight);

        sizeAllocations[size] = qty;
        allocatedTotal += qty;
      });

      // Rounding Adjustment
      const difference = Math.round(styleDemand) - allocatedTotal;

      if (difference !== 0) {

        // Find largest sales size
        let maxSize = null;
        let maxSales = 0;

        SIZE_ORDER.forEach(size => {
          const sales = sizeSalesMap[size] || 0;
          if (sales > maxSales) {
            maxSales = sales;
            maxSize = size;
          }
        });

        if (maxSize) {
          sizeAllocations[maxSize] += difference;
        }
      }
    }

    rows.push({
      styleId: style.styleId,
      totalSales,
      styleDemand: Math.round(styleDemand),
      sizes: sizeAllocations
    });

  });

  // Sort by total sales high → low
  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports.sizeCurve = {
    rows,
    selectedDays
  };
}
