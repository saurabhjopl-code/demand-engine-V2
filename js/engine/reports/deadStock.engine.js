import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

function getSortedMonths() {
  const months = [...new Set(dataStore.sales.map(r => r.Month))];
  return months.sort((a, b) => new Date(a) - new Date(b));
}

function getTotalSaleDays() {
  return dataStore.saleDays.reduce((sum, r) => {
    return sum + Number(r.Days || 0);
  }, 0);
}

export function buildDeadStock(stockMode = "seller") {

  const months = getSortedMonths();
  if (months.length < 2) {
    computedStore.reports.deadStock = { rows: [], stockMode };
    return;
  }

  const latestMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];

  const totalSaleDays = getTotalSaleDays();

  /* ===========================
     Pre-group sales by style
  =========================== */

  const salesByStyleMonth = {};

  dataStore.sales.forEach(r => {
    const style = r["Style ID"];
    const month = r.Month;
    if (!salesByStyleMonth[style]) salesByStyleMonth[style] = {};
    if (!salesByStyleMonth[style][month])
      salesByStyleMonth[style][month] = 0;
    salesByStyleMonth[style][month] += Number(r.Units || 0);
  });

  /* ===========================
     Pre-group stock
  =========================== */

  const stockByStyle = {};

  dataStore.stock.forEach(r => {

    const style = r["Style ID"];
    const units = Number(r.Units || 0);

    if (!stockByStyle[style])
      stockByStyle[style] = { seller: 0, total: 0 };

    stockByStyle[style].total += units;

    if (r.FC === "SELLER")
      stockByStyle[style].seller += units;
  });

  /* ===========================
     Pre-group total sales (for DRR)
  =========================== */

  const totalSalesByStyle = {};

  dataStore.sales.forEach(r => {
    const style = r["Style ID"];
    if (!totalSalesByStyle[style])
      totalSalesByStyle[style] = 0;
    totalSalesByStyle[style] += Number(r.Units || 0);
  });

  /* ===========================
     Style metadata
  =========================== */

  const styleMeta = {};
  dataStore.styleStatus.forEach(r => {
    styleMeta[r["Style ID"]] = {
      category: r.Category,
      remark: r["Company Remark"]
    };
  });

  const rows = [];

  Object.keys(stockByStyle).forEach(styleId => {

    const latestUnits =
      salesByStyleMonth[styleId]?.[latestMonth] || 0;

    const previousUnits =
      salesByStyleMonth[styleId]?.[previousMonth] || 0;

    const stock =
      stockMode === "seller"
        ? stockByStyle[styleId].seller
        : stockByStyle[styleId].total;

    if (latestUnits !== 0) return;
    if (previousUnits !== 0) return;
    if (stock <= 0) return;

    const totalUnits = totalSalesByStyle[styleId] || 0;
    const drr = totalSaleDays ? totalUnits / totalSaleDays : 0;
    const sc = drr > 0 ? stock / drr : 0;

    let risk = "Low";

    if (stock > 200) risk = "High Exposure";
    else if (stock >= 50) risk = "Moderate";

    rows.push({
      styleId,
      category: styleMeta[styleId]?.category || "",
      remark: styleMeta[styleId]?.remark || "",
      stock,
      sc,
      risk
    });

  });

  rows.sort((a, b) => b.stock - a.stock);

  computedStore.reports.deadStock = {
    rows,
    stockMode
  };
}
