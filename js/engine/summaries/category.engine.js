import { computedStore } from "../../store/computed.store.js";

export function buildCategory() {

  const master = computedStore.master;
  if (!master) return;

  const categoryMap = {};

  Object.values(master.styles).forEach(style => {

    const category = style.category || "-";

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += style.totalSales;
  });

  computedStore.summaries.category = categoryMap;
}
