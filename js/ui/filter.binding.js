import { computedStore } from "../store/computed.store.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applyFilters } from "../engine/filter.engine.js";

/**
 * Initializes all filter bindings
 * This matches lifecycle.js expected import:
 * initializeMonthFilter
 */
export function initializeMonthFilter(reRenderCallback) {

  const monthEl = document.getElementById("monthFilter");
  const searchEl = document.getElementById("globalSearch");

  if (!monthEl || !searchEl) {
    console.warn("Filter elements not found in DOM.");
    return;
  }

  // Populate Month Dropdown
  monthEl.innerHTML = `<option value="">All Months</option>`;

  (computedStore.months || []).forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthEl.appendChild(opt);
  });

  // Month Change
  monthEl.addEventListener("change", (e) => {

    const selectedMonth = e.target.value || null;

    computedStore.filters.month = selectedMonth;

    // Month requires full master rebuild
    buildMasterData(selectedMonth);

    applyFilters();

    reRenderCallback();
  });

  // Search (Override Mode)
  searchEl.addEventListener("input", (e) => {

    computedStore.filters.search = e.target.value;

    applyFilters();

    reRenderCallback();
  });
}
