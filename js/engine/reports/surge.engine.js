import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

function getSortedMonths() {
  const months = [...new Set(dataStore.sales.map(r => r.Month))];

  return months.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
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

export function buildSurge() {

  const months = getSortedMonths();

  if (months.length < 2) {
    computedStore.reports.surge = [];
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

    // Ignore both zero
    if (currentDRR === 0 && previousDRR === 0) return;

    let accel = 0;
    let risk = "Stable";

    if (previousDRR === 0 && currentDRR > 0) {
      accel = 100;
      risk = "New Surge";
    }
    else if (previousDRR > 0) {
      accel = ((currentDRR - previousDRR) / previousDRR) * 100;

      if (accel > 25 && (scMap[styleId] || 0) < 45)
        risk = "Critical Surge";
      else if (accel > 25)
        risk = "Growing Opportunity";
      else if (accel > 5)
        risk = "Early Growth";
      else if (accel < -50)
        risk = "Demand Drop";
    }

    rows.push({
      styleId,
      category: meta.category,
      previousDRR,
      currentDRR,
      accel,
      sc: scMap[styleId] || 0,
      risk
    });

  });

  rows.sort((a, b) => b.accel - a.accel);

  computedStore.reports.surge = {
    rows,
    currentMonth,
    previousMonth
  };
}
