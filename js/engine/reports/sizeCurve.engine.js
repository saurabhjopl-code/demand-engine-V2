import { computedStore } from "../../store/computed.store.js";
import { dataStore } from "../../store/data.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function getSalesMix(styleId) {

  const salesRows = dataStore.sales.filter(
    r => r["Style ID"] === styleId
  );

  const totalSales = salesRows.reduce(
    (sum, r) => sum + Number(r.Units || 0), 0
  );

  const sizeMix = {};

  SIZE_ORDER.forEach(size => sizeMix[size] = 0);

  if (totalSales === 0) return sizeMix;

  salesRows.forEach(r => {
    const size = r.Size;
    const units = Number(r.Units || 0);

    if (SIZE_ORDER.includes(size)) {
      sizeMix[size] += units;
    }
  });

  SIZE_ORDER.forEach(size => {
    sizeMix[size] = sizeMix[size] / totalSales;
  });

  return sizeMix;
}

export function buildSizeCurve(viewMode = "pending") {

  const demandData = computedStore.reports?.demand?.rows || [];

  const rows = [];

  demandData.forEach(styleRow => {

    const pending = styleRow.pending || 0;

    if (viewMode === "pending" && pending <= 0) return;

    const sizeMix = getSalesMix(styleRow.styleId);

    const sizeAllocation = {};

    SIZE_ORDER.forEach(size => {
      sizeAllocation[size] =
        Math.round(pending * sizeMix[size]);
    });

    rows.push({
      styleId: styleRow.styleId,
      styleDemand: pending,
      sizes: sizeAllocation
    });
  });

  rows.sort((a, b) => b.styleDemand - a.styleDemand);

  computedStore.reports.sizeCurve = {
    rows,
    viewMode
  };
}
