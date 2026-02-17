import { renderSurge } from "./reports/surge.binding.js";
import { buildSurge } from "../engine/reports/surge.engine.js";
import { buildDropRisk } from "../engine/reports/dropRisk.engine.js";
import { renderDropRisk } from "./reports/dropRisk.binding.js";


import { computedStore } from "../store/computed.store.js";

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

      const tabKey = tab.dataset.tab;

      if (tabKey === "demand") {
        buildDemand(45);
        renderDemand();
      }

      if (tabKey === "overstock") {
        buildOverstock(90);
        renderOverstock();
      }

      if (tabKey === "sizeCurve") {
        buildSizeCurve(45);
        renderSizeCurve();
      }

      if (tabKey === "broken") {
        buildBroken();
        renderBroken();
      }

      if (tabKey === "hero") {
        buildHero();
        renderHero();
      }

      if (tabKey === "dw") {
        buildDW();
        renderDW();
      }

      if (tabKey === "surge") {
        buildSurge();
        renderSurge();
      }

      if (tabKey === "dropRisk") {
        buildDropRisk();
        renderDropRisk();
      }

    });

  });

  // default load
  const defaultTab = document.querySelector('.tab[data-tab="demand"]');
  if (defaultTab) defaultTab.click();
}
