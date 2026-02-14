import { computedStore } from "../store/computed.store.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applyFilters } from "../engine/filter.engine.js";

export function initFilters(reRenderCallback) {

  const monthEl = document.getElementById("monthFilter");
  const searchEl = document.getElementById("globalSearch");

  // Populate Months
  monthEl.innerHTML = `<option value="">All Months</option>`;
  computedStore.months.forEach(m => {
    monthEl.innerHTML += `<option value="${m}">${m}</option>`;
  });

  monthEl.addEventListener("change", e => {
    computedStore.filters.month = e.target.value || null;
    buildMasterData(computedStore.filters.month);
    applyFilters();
    reRenderCallback();
  });

  searchEl.addEventListener("input", e => {
    computedStore.filters.search = e.target.value;
    applyFilters();
    reRenderCallback();
  });
}
