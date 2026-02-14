import { renderDemand } from "./reports/demand.binding.js";
import { renderOverstock } from "./reports/overstock.binding.js";
import { renderSizeCurve } from "./reports/sizeCurve.binding.js";
import { renderBroken } from "./reports/broken.binding.js";
import { renderHero } from "./reports/hero.binding.js";

import { buildDemand } from "../engine/reports/demand.engine.js";
import { buildOverstock } from "../engine/reports/overstock.engine.js";
import { buildSizeCurve } from "../engine/reports/sizeCurve.engine.js";
import { buildBroken } from "../engine/reports/broken.engine.js";
import { buildHero } from "../engine/reports/hero.engine.js";

export function renderAllReports() {

  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.textContent.trim().toLowerCase();

      if (tabName === "demand") {
        buildDemand(window.currentDemandDays || 45);
        renderDemand();
      }

      if (tabName === "overstock") {
        buildOverstock(window.currentOverstockThreshold || 90);
        renderOverstock();
      }

      if (tabName === "size curve") {
        buildSizeCurve(window.currentSizeCurveDays || 45);
        renderSizeCurve();
      }

      if (tabName === "broken") {
        buildBroken();
        renderBroken();
      }

      if (tabName === "hero") {
        buildHero();
        renderHero();
      }

    });

  });

  buildDemand(45);
  renderDemand();
}
