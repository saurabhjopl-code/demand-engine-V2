import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function getTotalSaleDays() {
  return dataStore.saleDays.reduce((sum, r) => {
    return sum + Number(r.Days || 0);
  }, 0);
}

export function buildSizeCurve(selectedDays = 45) {

  const totalSaleDays = getTotalSaleDays();
  if (!totalSaleDays) {
    computedStore.reports.sizeCurve = { rows: [], selectedDays };
    return;
  }

  /* ===============================
     Pre-group sales by Style
  =============================== */

  const salesByStyle = {};
  dataStore.sales.forEach(r => {
    const style = r["Style ID"];
    if (!salesByStyle[style]) salesByStyle[style] = [];
    salesByStyle[style].push(r);
  });

  /* ===============================
     Pre-group SELLER stock by Style
  =============================== */

  const sellerStockByStyle = {};
  dataStore.stock
    .filter(r => r.FC === "SELLER")
    .forEach(r => {
      const style = r["Style ID"];
      if (!sellerStockByStyle[style]) sellerStockByStyle[style] = 0;
      sellerStockByStyle[style] += Number(r.Units || 0);
    });

  const rows = [];

  Object.keys(salesByStyle).forEach(styleId => {

    const styleSalesRows = salesByStyle[styleId];

    const totalUnits = styleSalesRows.reduce(
      (sum, r) => sum + Number(r.Units || 0),
      0
    );

    if (!totalUnits) return;

    /* ===============================
       DRR
    =============================== */

    const drr = totalUnits / totalSaleDays;

    /* ===============================
       Required Demand
    =============================== */

    const required = drr * selectedDays;

    /* ===============================
       Seller Stock
    =============================== */

    const sellerStock = sellerStockByStyle[styleId] || 0;

    /* ===============================
       Final Demand
    =============================== */

    let demand = required - sellerStock;
    if (demand <= 0) return; // show only > 0

    /* ===============================
       Size Mix Allocation
    =============================== */

    const sizeSales = {};
    SIZE_ORDER.forEach(size => sizeSales[size] = 0);

    styleSalesRows.forEach(r => {
      const size = r.Size || "FS";
      if (!sizeSales[size]) sizeSales[size] = 0;
      sizeSales[size] += Number(r.Units || 0);
    });

    const sizes = {};
    SIZE_ORDER.forEach(size => {
      const share = sizeSales[size] / totalUnits;
      sizes[size] = Math.round(demand * share);
    });

    rows.push({
      styleId,
      styleDemand: Math.round(demand),
      sizes
    });

  });

  /* ===============================
     Sort by Highest Demand
  =============================== */

  rows.sort((a, b) => b.styleDemand - a.styleDemand);

  computedStore.reports.sizeCurve = {
    rows,
    selectedDays
  };
}
