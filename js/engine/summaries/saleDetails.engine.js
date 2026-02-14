import { computedStore } from "../../store/computed.store.js";

export function buildSaleDetails() {

  const master = computedStore.master;
  if (!master) return;

  let totalSales = 0;
  let totalStyles = 0;
  let totalSkus = 0;

  Object.values(master.styles).forEach(style => {
    totalSales += style.totalSales;
    totalStyles++;

    totalSkus += Object.keys(style.skus).length;
  });

  computedStore.summaries.saleDetails = {
    totalSales,
    totalStyles,
    totalSkus
  };
}
