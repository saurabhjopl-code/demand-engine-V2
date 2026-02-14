import { computedStore } from "../../store/computed.store.js";

export function buildScBand() {

  const master = computedStore.master;
  if (!master) return;

  const bandMap = {
    "0–30": { count: 0, totalUnits: 0, totalStock: 0 },
    "30–60": { count: 0, totalUnits: 0, totalStock: 0 },
    "60–120": { count: 0, totalUnits: 0, totalStock: 0 },
    "120+": { count: 0, totalUnits: 0, totalStock: 0 }
  };

  Object.values(master.styles).forEach(style => {

    const sc = style.sc;
    let band;

    if (sc < 30) band = "0–30";
    else if (sc < 60) band = "30–60";
    else if (sc < 120) band = "60–120";
    else band = "120+";

    bandMap[band].count += 1;
    bandMap[band].totalUnits += style.totalSales;
    bandMap[band].totalStock += style.totalStock;
  });

  computedStore.summaries.scBand = bandMap;
}
