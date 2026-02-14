import { loadAllSheets } from "../data/lifecycle.js";
import { buildMasterData } from "../engine/master.engine.js";
import { computedStore } from "../store/computed.store.js";
import { initMonthFilter } from "../ui/filter.controller.js";

export async function bootstrapApp() {
  try {
    console.log("Bootstrapping app...");

    await loadAllSheets();

    // Initial build (no month selected)
    recomputeAppState(null);

    // Initialize month filter
    initMonthFilter(onMonthChange);

  } catch (err) {
    console.error("Auto load failed:", err.message);
  }
}

function onMonthChange(selectedMonth) {
  recomputeAppState(selectedMonth);
}

function recomputeAppState(selectedMonth) {

  console.log("Recomputing App State for Month:", selectedMonth);

  // Build master data with month
  buildMasterData(selectedMonth);

  // Store selected month
  computedStore.selectedMonth = selectedMonth;

  // Trigger global render
  renderAll();
}

function renderAll() {
  // For now only logs.
  // Next stage summaries will hook here.

  console.log("Render triggered");
}
