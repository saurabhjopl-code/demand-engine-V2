import { renderDemand } from "./reports/demand.binding.js";
import { renderOverstock } from "./reports/overstock.binding.js";

import { buildDemand } from "../engine/reports/demand.engine.js";
import { buildOverstock } from "../engine/reports/overstock.engine.js";

import { renderSizeCurve } from "./reports/sizeCurve.binding.js";
import { buildSizeCurve } from "../engine/reports/sizeCurve.engine.js";


export function renderAllReports() {

  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove("active"));

      // Activate clicked tab
      tab.classList.add("active");

      const tabName = tab.textContent.trim().toLowerCase();

      if (tabName === "demand") {
        buildDemand(
          window.currentDemandDays || 45
        );
        renderDemand();
      }

      if (tabName === "overstock") {
        buildOverstock(
          window.currentOverstockThreshold || 90
        );
        renderOverstock();
      }
      if (tabName === "size curve") {
        buildSizeCurve(45);
        renderSizeCurve();
}

      // Future reports can be added here:
      // if (tabName === "broken") ...
      // if (tabName === "hero") ...
      // if (tabName === "dw") ...
    });

  });

  // Default load = Demand
  buildDemand(45);
  renderDemand();
}

