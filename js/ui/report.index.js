import { renderSurge } from "./reports/surge.binding.js";
import { buildSurge } from "../engine/reports/surge.engine.js";

import { buildDropRisk } from "../engine/reports/dropRisk.engine.js";
import { renderDropRisk } from "./reports/dropRisk.binding.js";

import { renderDeadStock } from "./reports/deadStock.binding.js";
import { buildDeadStock } from "../engine/reports/deadStock.engine.js";

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

      // Remove active from all
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabKey = tab.dataset.tab;

      switch (tabKey) {

        case "demand":
          buildDemand(45);
          renderDemand();
          break;

        case "overstock":
          buildOverstock(90);
          renderOverstock();
          break;

        case "sizeCurve":
          buildSizeCurve(45);
          renderSizeCurve();
          break;

        case "broken":
          buildBroken();
          renderBroken();
          break;

        case "hero":
          buildHero();
          renderHero();
          break;

        case "dw":
          buildDW();
          renderDW();
          break;

        case "surge":
          buildSurge();
          renderSurge();
          break;

        case "dropRisk":
          buildDropRisk();
          renderDropRisk();
          break;

        case "deadStock":
          buildDeadStock("seller");
          renderDeadStock();
          break;

        default:
          console.warn("Unknown tab:", tabKey);
          break;
      }

    });

  });

  // Default load
  const defaultTab = document.querySelector('.tab[data-tab="demand"]');
  if (defaultTab) defaultTab.click();
}
