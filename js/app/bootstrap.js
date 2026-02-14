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

  // Initialize stats structure
  const sheetCounts = {
    sales: 0,
    stock: 0,
    styleStatus: 0,
    saleDays: 0,
    sizeCount: 0,
    production: 0,
    meterCalc: 0,
    location: 0,
    xMarkup: 0
  };

  for (const key in SHEETS) {

    try {

      // Show currently loading sheet
      progressStats.innerHTML = `Loading: ${key}...`;

      const text = await fetchCSV(SHEETS[key]);
      const parsed = parseCSV(text);

      dataStore[key] = parsed;

      sheetCounts[key] = parsed.length;

      loaded++;

      const percent = Math.round((loaded / total) * 100);

      progressFill.style.width = `${percent}%`;
      progressFill.textContent = `${percent}%`;

      // Update row counts LIVE
      progressStats.innerHTML = `
        Sales: ${sheetCounts.sales} |
        Stock: ${sheetCounts.stock} |
        Style Status: ${sheetCounts.styleStatus} |
        Sale Days: ${sheetCounts.saleDays} |
        Size Count: ${sheetCounts.sizeCount} |
        Production: ${sheetCounts.production} |
        Meter Calc: ${sheetCounts.meterCalc} |
        Location: ${sheetCounts.location} |
        X Mark Up: ${sheetCounts.xMarkup}
      `;

    } catch (err) {
      console.error("Sheet failed:", key, err);
    }
  }

  // Smooth finish
  progressStats.innerHTML += ` | ✔ All Sheets Loaded`;
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
