import { computedStore } from "../../store/computed.store.js";

export function buildFcStock() {

  const master = computedStore.master;
  if (!master) return;

  let totalStock = 0;
  let totalProduction = 0;

  Object.values(master.styles).forEach(style => {
    totalStock += style.totalStock;
    totalProduction += style.totalProduction;
  });

  computedStore.summaries.fcStock = {
    totalStock,
    totalProduction
  };
}
