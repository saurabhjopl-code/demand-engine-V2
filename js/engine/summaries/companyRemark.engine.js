import { computedStore } from "../../store/computed.store.js";
import { dataStore } from "../../store/data.store.js";

export function buildCompanyRemark() {

  const master = computedStore.master;
  if (!master) return;

  const saleDays = dataStore.saleDays;

  let totalDays = 0;
  saleDays.forEach(row => {
    totalDays += Number(row["Days"] || 0);
  });

  const remarkMap = {};

  Object.values(master.styles).forEach(style => {

    const remark = style.remark || "-";

    if (!remarkMap[remark]) {
      remarkMap[remark] = {
        totalUnits: 0,
        totalStock: 0
      };
    }

    remarkMap[remark].totalUnits += style.totalSales;
    remarkMap[remark].totalStock += style.totalStock;
  });

  let grandUnits = 0;
  let grandStock = 0;

  const rows = Object.keys(remarkMap).map(remark => {

    const totalUnits = remarkMap[remark].totalUnits;
    const totalStock = remarkMap[remark].totalStock;

    const drr = totalDays > 0 ? totalUnits / totalDays : 0;
    const sc = drr > 0 ? totalStock / drr : 0;

    grandUnits += totalUnits;
    grandStock += totalStock;

    return {
      remark,
      totalUnits,
      totalStock,
      drr,
      sc
    };
  });

  const grandDRR = totalDays > 0 ? grandUnits / totalDays : 0;
  const grandSC = grandDRR > 0 ? grandStock / grandDRR : 0;

  computedStore.summaries.companyRemark = {
    rows,
    grandUnits,
    grandStock,
    grandDRR,
    grandSC
  };
}
