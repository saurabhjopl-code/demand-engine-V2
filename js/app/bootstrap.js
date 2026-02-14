import { loadAllSheets } from "./lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applyFilters } from "../engine/filter.engine.js";
import { initFilters } from "../ui/filter.binding.js";

export async function bootstrapApp() {

  try {

    // 1️⃣ Load raw data
    await loadAllSheets();

    // 2️⃣ Build master dataset (all months default)
    buildMasterData(null);

    // 3️⃣ Apply initial filters
    applyFilters();

    // 4️⃣ Initialize filter bindings
    initFilters(renderAll);

    // 5️⃣ Initial render
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
