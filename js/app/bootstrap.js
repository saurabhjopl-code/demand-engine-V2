import { loadAllSheets } from "./lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applyFilters } from "../engine/filter.engine.js";
import { initFilters } from "../ui/filter.binding.js";

export async function bootstrapApp() {

  try {

    await loadAllSheets();

    // Initial build (no month selected)
    buildMasterData(null);

    // Initial filter pass
    applyFilters();

    // Initialize filter bindings
    initFilters(renderAll);

    renderAll();

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

function renderAll() {
  console.log("Filtered SKU Count:", window?.computedStore?.filteredSKU?.length);
}
