import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

export function buildSaleDetails() {

  const sales = dataStore.sales;
  const saleDays = dataStore.saleDays;

  const monthDaysMap = {};
  saleDays.forEach(row => {
    monthDaysMap[row["Month"]] = Number(row["Days"] || 0);
  });

  const monthMap = {};

  sales.forEach(row => {

    const month = row["Month"];
    const units = Number(row["Units"] || 0);

    if (!month) return;

    if (!monthMap[month]) {
      monthMap[month] = {
        totalUnits: 0,
        days: monthDaysMap[month] || 0
      };
    }

    monthMap[month].totalUnits += units;
  });

  let grandTotalUnits = 0;
  let grandTotalDays = 0;

  const result = [];

  Object.keys(monthMap)
    .sort()
    .forEach(month => {

      const totalUnits = monthMap[month].totalUnits;
      const days = monthMap[month].days;

      const drr = days > 0 ? totalUnits / days : 0;

      grandTotalUnits += totalUnits;
      grandTotalDays += days;

      result.push({
        month,
        totalUnits,
        drr
      });
    });

  const grandDRR = grandTotalDays > 0
    ? grandTotalUnits / grandTotalDays
    : 0;

  computedStore.summaries.saleDetails = {
    rows: result,
    grandTotalUnits,
    grandDRR
  };
}
