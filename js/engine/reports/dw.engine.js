import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

function parseMonth(monthStr) {
  // Example: "DEC-2025"
  const [mon, year] = monthStr.split("-");
  const monthMap = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3,
    MAY: 4, JUN: 5, JUL: 6, AUG: 7,
    SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };
  return new Date(Number(year), monthMap[mon.toUpperCase()], 1);
}

function getLast3Months() {

  const months = [...new Set(dataStore.sales.map(r => r.Month))];

  return months
    .sort((a, b) => parseMonth(a) - parseMonth(b))
    .slice(-3);
}

function calculateMonthlyTotals(months) {

  const totals = {};

  months.forEach(month => {
    totals[month] = dataStore.sales
      .filter(r => r.Month === month)
      .reduce((sum, r) => sum + Number(r.Units || 0), 0);
  });

  return totals;
}

export function buildDW() {

  const months = getLast3Months(); // Chronological order
  const [m1, m2, m3] = months;

  const monthlyTotals = calculateMonthlyTotals(months);

  const styleMap = {};

  dataStore.sales.forEach(row => {

    const style = row["Style ID"];
    const month = row.Month;
    const units = Number(row.Units || 0);

    if (!styleMap[style]) {
      styleMap[style] = { sales: {} };
    }

    if (!styleMap[style].sales[month]) {
      styleMap[style].sales[month] = 0;
    }

    styleMap[style].sales[month] += units;
  });

  const result = [];

  Object.entries(styleMap).forEach(([style, data]) => {

    const salesDec = data.sales[m1] || 0;
    const salesJan = data.sales[m2] || 0;
    const salesFeb = data.sales[m3] || 0;

    const dwDec = monthlyTotals[m1] ? (salesDec / monthlyTotals[m1]) * 100 : 0;
    const dwJan = monthlyTotals[m2] ? (salesJan / monthlyTotals[m2]) * 100 : 0;
    const dwFeb = monthlyTotals[m3] ? (salesFeb / monthlyTotals[m3]) * 100 : 0;

    function getMovement(prev, curr) {

      if (prev === 0 && curr > 0) return "New";
      if (prev > 0 && curr === 0) return "Dropped Out";

      const diff = curr - prev;

      if (Math.abs(diff) < 0.05) return "Stable";
      if (diff > 0) return "Improved";
      return "Dropped";
    }

    result.push({
      style,
      months,
      sales: {
        [m1]: salesDec,
        [m2]: salesJan,
        [m3]: salesFeb
      },
      dw: {
        [m1]: dwDec,
        [m2]: dwJan,
        [m3]: dwFeb
      },
      movement1: getMovement(dwDec, dwJan),
      movement2: getMovement(dwJan, dwFeb),
      latestDW: dwFeb
    });
  });

  // Sort by Latest Month DW DESC
  result.sort((a, b) => b.latestDW - a.latestDW);

  computedStore.dw = result;
}
