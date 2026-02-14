import { SHEETS } from "../config/sheet.config.js";
import { fetchCSV } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { dataStore } from "../store/data.store.js";

import { buildCoreEngine } from "../engine/core.engine.js";

import { buildAllSummaries } from "../engine/summary.index.js";
import { renderAllSummaries } from "../ui/summary.index.js";

import { buildAllReports } from "../engine/report.index.js";
import { renderAllReports } from "../ui/report.index.js";

async function loadAllSheets() {

  const progressFill = document.querySelector(".progress-fill");
  const progressStats = document.querySelector(".progress-stats");

  let loaded = 0;
  const total = Object.keys(SHEETS).length;

  for (const key in SHEETS) {

    try {
      const text = await fetchCSV(SHEETS[key]);
      dataStore[key] = parseCSV(text);

      loaded++;
      progressFill.style.width = `${(loaded / total) * 100}%`;

    } catch (err) {
      console.error("Sheet failed:", key, err);
    }
  }

  // Populate stats row
  progressStats.innerHTML = `
    Sales: ${dataStore.sales.length} |
    Stock: ${dataStore.stock.length} |
    Style Status: ${dataStore.styleStatus.length} |
    Sale Days: ${dataStore.saleDays.length} |
    Size Count: ${dataStore.sizeCount.length} |
    Production: ${dataStore.production.length} |
    Meter Calc: ${dataStore.meterCalc.length} |
    Location: ${dataStore.location.length} |
    X Mark Up: ${dataStore.xMarkup.length}
  `;
}

async function bootstrap() {

  try {

    await loadAllSheets();

    // CORE MASTER CONSOLIDATION
    buildCoreEngine();

    // SUMMARIES
    buildAllSummaries();
    renderAllSummaries();

    // REPORTS (Default 45D Demand)
    buildAllReports();
    renderAllReports();

    console.log("Demand Planning Engine V2.5 Ready");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

bootstrap();
