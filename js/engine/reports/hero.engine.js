import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";
import { getSellerStockByStyle } from "../../utils/stock.utils.js";
import { SIZE_SEQUENCE } from "../../config/constants.js";

function getLast3Months() {
  const months = [...new Set(dataStore.sales.map(r => r.Month))];
  return months.sort().slice(-3); // DEC, JAN, FEB
}

function buildMonthlyRanking(month) {

  const monthData = dataStore.sales.filter(r => r.Month === month);

  const styleMap = {};

  monthData.forEach(row => {
    const style = row["Style ID"];
    const units = Number(row.Units || 0);

    if (!styleMap[style]) styleMap[style] = 0;
    styleMap[style] += units;
  });

  const saleDaysRow = dataStore.saleDays.find(r => r.Month === month);
  const saleDays = saleDaysRow ? Number(saleDaysRow.Days || 1) : 1;

  const ranked = Object.entries(styleMap)
    .map(([style, sales]) => ({
      style,
      sales,
      drr: sales / saleDays
    }))
    .sort((a, b) => b.sales - a.sales);

  ranked.forEach((r, index) => {
    r.rank = index + 1;
  });

  return ranked;
}

function getBrokenCount(styleId) {

  const sellerStock = getSellerStockByStyle(styleId);

  let brokenCount = 0;

  SIZE_SEQUENCE.forEach(size => {
    const stock = sellerStock[size] || 0;
    if (stock >= 0 && stock <= 5) brokenCount++;
  });

  return brokenCount;
}

function getRemark(dec, jan, feb) {

  if (!dec) return "New Addition";

  if (feb.rank < jan.rank) return "Rank Improved";
  if (feb.rank > jan.rank) return "Rank Dropped";

  if (dec.drr > jan.drr && jan.drr > feb.drr) return "DRR Dropped";

  return "";
}

export function buildHero() {

  const months = getLast3Months();
  const [m1, m2, m3] = months;

  const r1 = buildMonthlyRanking(m1);
  const r2 = buildMonthlyRanking(m2);
  const r3 = buildMonthlyRanking(m3);

  const topPool = new Set([
    ...r1.slice(0, 20).map(r => r.style),
    ...r2.slice(0, 20).map(r => r.style),
    ...r3.slice(0, 20).map(r => r.style)
  ]);

  const heroData = [];

  topPool.forEach(style => {

    const dec = r1.find(r => r.style === style);
    const jan = r2.find(r => r.style === style);
    const feb = r3.find(r => r.style === style);

    const sellerStock = getSellerStockByStyle(style);
    const totalSellerStock = Object.values(sellerStock)
      .reduce((a, b) => a + b, 0);

    const saleDaysRow = dataStore.saleDays.find(r => r.Month === m3);
    const saleDays = saleDaysRow ? Number(saleDaysRow.Days || 1) : 1;

    const sc = feb ? (totalSellerStock / feb.drr) : 0;

    heroData.push({
      style,
      months,
      sales: {
        [m1]: dec?.sales || 0,
        [m2]: jan?.sales || 0,
        [m3]: feb?.sales || 0
      },
      ranks: {
        [m1]: dec?.rank || "-",
        [m2]: jan?.rank || "-",
        [m3]: feb?.rank || "-"
      },
      drr: {
        [m1]: dec?.drr || 0,
        [m2]: jan?.drr || 0,
        [m3]: feb?.drr || 0
      },
      sc: sc.toFixed(1),
      broken: getBrokenCount(style),
      remark: getRemark(dec, jan, feb),
      latestRank: feb?.rank || 9999
    });

  });

  heroData.sort((a, b) => a.latestRank - b.latestRank);

  computedStore.hero = heroData.slice(0, 20); // show only top 20 latest

}
