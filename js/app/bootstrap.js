import { SHEETS } from "../config/sheet.config.js";
import { fetchCSV } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { dataStore } from "../store/data.store.js";

import { buildCoreEngine } from "../engine/core.engine.js";
import { buildAllSummaries } from "../engine/summary.index.js";
import { renderAllSummaries } from "../ui/summary.index.js";
import { renderAllReports } from "../ui/report.index.js";

import { exportAllReports } from "../utils/export.utils.js";

window.globalSearchTerm = "";

function wireGlobalSearch() {
  const input = document.querySelector(".search-input");
  input.addEventListener("input", (e) => {
    window.globalSearchTerm = e.target.value;
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) activeTab.click();
  });
}

function wireExportButton() {
  const btn = document.querySelector(".btn-primary");
  btn.addEventListener("click", () => {
    exportAllReports();
  });
}

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

    buildCoreEngine();
    buildAllSummaries();
    renderAllSummaries();
    renderAllReports();

    wireGlobalSearch();
    wireExportButton();

    console.log("App Ready");
  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

bootstrap();
