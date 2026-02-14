import { computedStore } from "../../store/computed.store.js";

export function buildScBand() {

  const master = computedStore.master;
  if (!master) return;

  const bandCount = {
    Critical: 0,
    Risk: 0,
    Healthy: 0,
    Safe: 0,
    Watch: 0,
    Overstock: 0
  };

  Object.values(master.styles).forEach(style => {
    bandCount[style.scBand] =
      (bandCount[style.scBand] || 0) + 1;
  });

  computedStore.summaries.scBand = bandCount;
}
