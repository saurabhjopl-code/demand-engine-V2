import { computedStore } from "../../store/computed.store.js";

export function buildSizeWise() {

  const master = computedStore.master;
  if (!master) return;

  const sizeMap = {};

  Object.values(master.styles).forEach(style => {
    Object.values(style.skus).forEach(sku => {
      Object.keys(sku.sizes).forEach(size => {

        const sizeTotal =
          sku.sizes[size].totalUnits || 0;

        if (!sizeMap[size]) {
          sizeMap[size] = 0;
        }

        sizeMap[size] += sizeTotal;
      });
    });
  });

  computedStore.summaries.sizeWise = sizeMap;
}
