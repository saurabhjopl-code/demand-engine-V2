import { computedStore } from "../../store/computed.store.js";
import { dataStore } from "../../store/data.store.js";

export function buildCategory() {

  const master = computedStore.master;
  if (!master) return;

  const saleDays = dataStore.saleDays;

  let totalDays = 0;
  saleDays.forEach(row => {
    totalDays += Number(row["Days"] || 0);
  });

  const categoryMap = {};

  Object.values(master.styles).forEach(style => {

    const category = style.category || "-";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        totalUnits: 0,
        totalStock: 0
      };
    }

    categoryMap[category].totalUnits += style.totalSales;
    categoryMap[category].totalStock += style.totalStock;
  });

  let grandUnits = 0;
  let grandStock = 0;

  const rows = Object.keys(categoryMap).map(category => {

    const totalUnits = categoryMap[category].totalUnits;
    const totalStock = categoryMap[category].totalStock;

    const drr = totalDays > 0 ? totalUnits / totalDays : 0;
    const sc = drr > 0 ? totalStock / drr : 0;

    grandUnits += totalUnits;
    grandStock += totalStock;

    return {
      category,
      totalUnits,
      totalStock,
      drr,
      sc
    };
  });

  const grandDRR = totalDays > 0 ? grandUnits / totalDays : 0;
  const grandSC = grandDRR > 0 ? grandStock / grandDRR : 0;

  computedStore.summaries.category = {
    rows,
    grandUnits,
    grandStock,
    grandDRR,
    grandSC
  };
}
