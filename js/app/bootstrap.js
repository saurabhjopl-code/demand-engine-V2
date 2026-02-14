import { loadAllSheets } from "./lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { initFilters } from "../ui/filter.binding.js";

export async function bootstrapApp() {

  try {

    // Load all sheets
    await loadAllSheets();

    // Build master dataset (ALL DATA)
    buildMasterData(null);

    // Default = no filtering
    window.computedStore.filteredSKU = window.computedStore.masterData;

    // Init search binding only
    initFilters(renderAll);

    renderAll();

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

function renderAll() {
  console.log(
    "Filtered SKU Count:",
    window?.computedStore?.filteredSKU?.length
  );
}
