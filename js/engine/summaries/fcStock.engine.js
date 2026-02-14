import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

export function buildFcStock() {

  const sales = dataStore.sales;
  const stock = dataStore.stock;
  const saleDays = dataStore.saleDays;

  let totalDays = 0;
  saleDays.forEach(row => {
    totalDays += Number(row["Days"] || 0);
  });

  const fcMap = {};

  // Aggregate Sales by FC
  sales.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = {
        totalStock: 0,
        totalUnits: 0
      };
    }

    fcMap[fc].totalUnits += units;
  });

  // Aggregate Stock by FC
  stock.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = {
        totalStock: 0,
        totalUnits: 0
      };
    }

    fcMap[fc].totalStock += units;
  });

  let grandStock = 0;
  let grandUnits = 0;

  const rows = Object.keys(fcMap).map(fc => {

    const totalStock = fcMap[fc].totalStock;
    const totalUnits = fcMap[fc].totalUnits;

    const drr = totalDays > 0 ? totalUnits / totalDays : 0;
    const sc = drr > 0 ? totalStock / drr : 0;

    grandStock += totalStock;
    grandUnits += totalUnits;

    return {
      fc,
      totalStock,
      totalUnits,
      drr,
      sc
    };
  });

  const grandDRR = totalDays > 0 ? grandUnits / totalDays : 0;
  const grandSC = grandDRR > 0 ? grandStock / grandDRR : 0;

  computedStore.summaries.fcStock = {
    rows,
    grandStock,
    grandUnits,
    grandDRR,
    grandSC
  };
}
