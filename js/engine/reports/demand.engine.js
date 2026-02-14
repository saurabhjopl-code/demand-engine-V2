import { computedStore } from "../../store/computed.store.js";

export function buildDemand(selectedDays = 45) {

  const master = computedStore.master;
  if (!master) return;

  const rows = [];

  Object.values(master.styles).forEach(style => {

    const drr = style.drr;
    const totalSales = style.totalSales;
    const totalStock = style.totalStock;
    const production = style.totalProduction || 0; // ✅ FIXED

    const sc = drr > 0 ? totalStock / drr : 0;

    const requiredDemand = drr * selectedDays;

    let directDemand = requiredDemand - totalStock;
    if (directDemand < 0) directDemand = 0;

    let pending = directDemand - production;
    if (pending < 0) pending = 0;

    rows.push({
      styleId: style.styleId,
      category: style.category,
      remark: style.remark,
      totalSales,
      totalStock,
      drr,
      sc,
      requiredDemand,
      directDemand,
      production,
      pending
    });
  });

  // Sort by Total Sales high → low
  rows.sort((a, b) => b.totalSales - a.totalSales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = {
    rows,
    selectedDays
  };
}
