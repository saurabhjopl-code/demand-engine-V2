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

/* =========================
   GLOBAL SEARCH
========================= */

function wireGlobalSearch() {
  const input = document.querySelector(".search-input");

  if (!input) return;

  input.addEventListener("input", (e) => {
    window.globalSearchTerm = e.target.value;

    const activeItem = document.querySelector(".sidebar-item.active");
    if (activeItem) activeItem.click();
  });
}

/* =========================
   EXPORT BUTTON
========================= */

function wireExportButton() {
  const btn = document.querySelector(".btn-primary");
  if (!btn) return;

  btn.addEventListener("click", () => {
    exportAllReports();
  });
}

/* =========================
   SIDEBAR TOGGLE (FIXED)
========================= */

function wireSidebarToggle() {

  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  if (!sidebar || !toggleBtn) {
    console.warn("Sidebar elements not found");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

/* =========================
   LOAD SHEETS
========================= */

async function loadAllSheets() {

  const progressFill = document.querySelector(".progress-fill");
  const progressStats = document.querySelector(".progress-stats");

  let loaded = 0;
  const total = Object.keys(SHEETS).length;

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

      if (progressStats)
        progressStats.innerHTML = `Loading: ${key}...`;

      const text = await fetchCSV(SHEETS[key]);
      const parsed = parseCSV(text);

      dataStore[key] = parsed;
      sheetCounts[key] = parsed.length;

      loaded++;

      const percent = Math.round((loaded / total) * 100);

      if (progressFill) {
        progressFill.style.width = `${percent}%`;
        progressFill.textContent = `${percent}%`;
      }

      if (progressStats) {
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
      }

    } catch (err) {
      console.error("Sheet failed:", key, err);
    }
  }

  if (progressStats)
    progressStats.innerHTML += ` | ✔ All Sheets Loaded`;
}

/* =========================
   BOOTSTRAP
========================= */

async function bootstrap() {

  try {

    await loadAllSheets();

    buildCoreEngine();
    buildAllSummaries();
    renderAllSummaries();
    renderAllReports();

    wireGlobalSearch();
    wireExportButton();
    wireSidebarToggle();

    console.log("App Ready");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

bootstrap();
