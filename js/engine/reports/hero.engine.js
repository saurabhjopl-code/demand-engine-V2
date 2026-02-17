import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

const MONTH_MAP = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3,
  MAY: 4, JUN: 5, JUL: 6, AUG: 7,
  SEP: 8, OCT: 9, NOV: 10, DEC: 11
};

function parseMonth(monthStr) {
  const [mon, year] = monthStr.split("-");
  return new Date(Number(year), MONTH_MAP[mon], 1);
}

function sortMonthsChronologically(months) {
  return [...months].sort((a, b) => parseMonth(a) - parseMonth(b));
}

function getStyleMeta(styleId) {
  const row = dataStore.styleStatus.find(r => r["Style ID"] === styleId);
  return {
    remark: row?.["Company Remark"] || ""
  };
}

export function buildHero(topN = 20) {

  const sales = dataStore.sales;

  // Get unique months
  const months = [...new Set(sales.map(r => r.Month))];
  const sortedMonths = sortMonthsChronologically(months);

  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];

  // Build style → month → sales map
  const styleMap = {};

  sales.forEach(row => {

    const style = row["Style ID"];
    const month = row.Month;
    const units = Number(row.Units || 0);

    if (!styleMap[style]) {
      styleMap[style] = {};
    }

    if (!styleMap[style][month]) {
      styleMap[style][month] = 0;
    }

    styleMap[style][month] += units;
  });

  // Rank per month
  const monthRankMap = {};

  sortedMonths.forEach(month => {

    const arr = Object.entries(styleMap).map(([style, months]) => ({
      style,
      sales: months[month] || 0
    }));

    arr.sort((a, b) => b.sales - a.sales);

    monthRankMap[month] = {};
    arr.forEach((item, index) => {
      monthRankMap[month][item.style] = index + 1;
    });
  });

  const result = [];

  Object.entries(styleMap).forEach(([style, months]) => {

    const meta = getStyleMeta(style);

    const salesByMonth = {};
    const ranksByMonth = {};
    const drrByMonth = {};

    sortedMonths.forEach(month => {

      const totalSales = months[month] || 0;
      salesByMonth[month] = totalSales;

      ranksByMonth[month] =
        monthRankMap[month][style] || null;

      // Use actual sale days
      const saleDayRow = dataStore.saleDays.find(
        r => r.Month === month
      );

      const days = saleDayRow
        ? Number(saleDayRow.Days || 1)
        : 1;

      drrByMonth[month] =
        totalSales / days;
    });

    // Movement calculation
    const currRank = ranksByMonth[latestMonth];
    const prevRank = ranksByMonth[previousMonth];

    const currDRR = drrByMonth[latestMonth];
    const prevDRR = drrByMonth[previousMonth];

    const rankImproved = currRank <= prevRank;
    const drrImproved = currDRR >= prevDRR;

    let remarkType = "mixed";
    let remarkText = "";

    if (rankImproved && drrImproved) {
      remarkType = "positive";
      remarkText = "Rank Improved & DRR Improved";
    } else if (!rankImproved && !drrImproved) {
      remarkType = "negative";
      remarkText = "Rank Dropped & DRR Dropped";
    } else {
      remarkType = "mixed";
      remarkText = rankImproved
        ? "Rank Improved & DRR Dropped"
        : "Rank Dropped & DRR Improved";
    }

    result.push({
      style,
      months: sortedMonths,
      sales: salesByMonth,
      ranks: ranksByMonth,
      drr: drrByMonth,
      remarkText,
      remarkType,
      latestRank: currRank
    });
  });

  // Sort by latest rank
  result.sort((a, b) => a.latestRank - b.latestRank);

  computedStore.hero = result.slice(0, topN);
  computedStore.heroMeta = {
    topN,
    months: sortedMonths
  };
}
