import { renderDemand } from "./reports/demand.binding.js";
import { renderOverstock } from "./reports/overstock.binding.js";
import { renderSizeCurve } from "./reports/sizeCurve.binding.js";
import { renderBroken } from "./reports/broken.binding.js";
import { renderHero } from "./reports/hero.binding.js";
import { renderDW } from "./reports/dw.binding.js";

import { buildDemand } from "../engine/reports/demand.engine.js";
import { buildOverstock } from "../engine/reports/overstock.engine.js";
import { buildSizeCurve } from "../engine/reports/sizeCurve.engine.js";
import { buildBroken } from "../engine/reports/broken.engine.js";
import { buildHero } from "../engine/reports/hero.engine.js";
import { buildDW } from "../engine/reports/dw.engine.js";

export function renderAllReports() {

  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.textContent.trim().toLowerCase();

      if (tabName === "demand") {
        buildDemand(45);
        renderDemand();
      }

      if (tabName === "overstock") {
        buildOverstock(90);
        renderOverstock();
      }

      if (tabName === "size curve") {
        buildSizeCurve(45);
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

      if (tabName === "dw") {
        buildDW();
        renderDW();
      }

    });

  });

  buildDemand(45);
  renderDemand();
}
