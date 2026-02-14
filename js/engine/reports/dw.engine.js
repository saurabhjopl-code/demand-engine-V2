import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

function getLast3Months() {
  const months = [...new Set(dataStore.sales.map(r => r.Month))];
  return months.sort().slice(-3);
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

  const months = getLast3Months();
  const [m1, m2, m3] = months;

  const monthlyTotals = calculateMonthlyTotals(months);

  const styleMap = {};

  // Build sales per style per month
  dataStore.sales.forEach(row => {

    const style = row["Style ID"];
    const month = row.Month;
    const units = Number(row.Units || 0);

    if (!styleMap[style]) {
      styleMap[style] = {
        sales: {},
        dw: {}
      };
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
      movement1: getMovement(dwDec, dwJan), // Dec→Jan
      movement2: getMovement(dwJan, dwFeb), // Jan→Feb
      latestDW: dwFeb
    });

  });

  // Sort by latest month DW (High → Low)
  result.sort((a, b) => b.latestDW - a.latestDW);

  computedStore.dw = result;
}
