import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

function getSortedMonths() {
  const months = [...new Set(dataStore.sales.map(r => r.Month))];

  return months.sort((a, b) => {
    return new Date(a) - new Date(b);
  });
}

function getSaleDays(month) {
  const row = dataStore.saleDays.find(r => r.Month === month);
  return row ? Number(row.Days || 0) : 0;
}

function getSCMap() {
  const demandRows = computedStore.reports?.demand?.rows || [];
  const map = {};

  demandRows.forEach(r => {
    map[r.styleId] = r.sc;
  });

  return map;
}

function getStyleMeta(styleId) {
  const row = dataStore.styleStatus.find(
    r => r["Style ID"] === styleId
  );

  return {
    category: row?.Category || ""
  };
}

export function buildDropRisk() {

  const months = getSortedMonths();

  if (months.length < 2) {
    computedStore.reports.dropRisk = { rows: [] };
    return;
  }

  const currentMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];

  const currentDays = getSaleDays(currentMonth);
  const previousDays = getSaleDays(previousMonth);

  const scMap = getSCMap();

  const styleSet = new Set(
    dataStore.sales.map(r => r["Style ID"])
  );

  const rows = [];

  styleSet.forEach(styleId => {

    const meta = getStyleMeta(styleId);

    const currentUnits = dataStore.sales
      .filter(r =>
        r["Style ID"] === styleId &&
        r.Month === currentMonth
      )
      .reduce((sum, r) => sum + Number(r.Units || 0), 0);

    const previousUnits = dataStore.sales
      .filter(r =>
        r["Style ID"] === styleId &&
        r.Month === previousMonth
      )
      .reduce((sum, r) => sum + Number(r.Units || 0), 0);

    const currentDRR =
      currentDays > 0 ? currentUnits / currentDays : 0;

    const previousDRR =
      previousDays > 0 ? previousUnits / previousDays : 0;

    // Ignore if previous DRR = 0
    if (previousDRR === 0) return;

    // Calculate drop %
    let drop = 0;

    if (currentDRR === 0 && previousDRR > 0) {
      drop = 100;
    } else {
      drop = ((previousDRR - currentDRR) / previousDRR) * 100;
    }

    // Ignore non-drop or negative
    if (drop <= 0) return;

    let risk = "Stable";
    const sc = scMap[styleId] || 0;

    if (drop > 50 && sc > 90)
      risk = "High Overstock Risk";
    else if (drop > 30 && sc > 60)
      risk = "Stock Building";
    else if (drop > 10)
      risk = "Early Weakness";

    rows.push({
      styleId,
      category: meta.category,
      previousDRR,
      currentDRR,
      drop,
      sc,
      risk
    });

  });

  rows.sort((a, b) => b.drop - a.drop);

  computedStore.reports.dropRisk = {
    rows,
    currentMonth,
    previousMonth,
    showOnlyMajor: true
  };
}
