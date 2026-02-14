import { computedStore } from "../store/computed.store.js";

/**
 * Initialize ONLY Global Search
 */
export function initFilters(reRenderCallback) {

  const searchEl = document.getElementById("globalSearch");

  if (!searchEl) {
    console.warn("Search element not found in DOM.");
    return;
  }

  searchEl.addEventListener("input", (e) => {

    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      computedStore.filteredSKU = computedStore.masterData;
    } else {
      computedStore.filteredSKU = computedStore.masterData.filter(row =>
        String(row.uniwareSku || "").toLowerCase().includes(query) ||
        String(row.styleId || "").toLowerCase().includes(query)
      );
    }

    reRenderCallback();
  });
}
