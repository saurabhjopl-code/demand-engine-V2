import { loadAllSheets } from "../data/lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { applyFilters } from "../engine/filter.engine.js";
import { initFilters } from "../ui/filter.binding.js";

export async function bootstrapApp() {

  await loadAllSheets();

  buildMasterData(null);
  applyFilters();

  initFilters(renderAll);

  renderAll();
}

function renderAll() {
  console.log("Filtered SKU Count:", 
    document.readyState === "complete" ? 
    window.computedStore?.filteredSKU?.length : ""
  );
}
