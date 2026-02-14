import { renderDemand } from "./reports/demand.binding.js";
import { renderOverstock } from "./reports/overstock.binding.js";

import { buildDemand } from "../engine/reports/demand.engine.js";
import { buildOverstock } from "../engine/reports/overstock.engine.js";

export function renderAllReports() {

  const tabs = document.querySelectorAll(".report-tab");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      // Remove active from all
      tabs.forEach(t => t.classList.remove("active"));

      // Add active to clicked
      tab.classList.add("active");

      const report = tab.dataset.report;

      if (report === "demand") {
        buildDemand(
          window.currentDemandDays || 45
        );
        renderDemand();
      }

      if (report === "overstock") {
        buildOverstock(
          window.currentOverstockThreshold || 90
        );
        renderOverstock();
      }

    });
  });

  // Default render Demand
  renderDemand();
}
