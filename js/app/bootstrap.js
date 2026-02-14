import { loadAllSheets } from "./lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applySearch } from "../engine/search.engine.js";

export async function bootstrapApp() {

  try {

    await loadAllSheets();

    // Build Master Dataset
    buildMasterData(null);

    // Initialize Search Only
    initializeSearch(renderAll);

    renderAll();

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

function initializeSearch(reRenderCallback) {

  const searchEl = document.getElementById("globalSearch");

  if (!searchEl) return;

  searchEl.addEventListener("input", (e) => {
    applySearch(e.target.value);
    reRenderCallback();
  });
}

function renderAll() {
  console.log("Filtered SKU Count:", window?.computedStore?.filteredSKU?.length);
}
