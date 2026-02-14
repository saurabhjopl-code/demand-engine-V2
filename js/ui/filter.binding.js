import { computedStore } from "../store/computed.store.js";
import { filterStore } from "../store/filter.store.js";
import { buildMasterData } from "../engine/master.engine.js";

export function initializeMonthFilter() {

  const monthSelect = document.querySelector(".filters-left select");

  if (!monthSelect) return;

  // Clear existing options
  monthSelect.innerHTML = "";

  // Default Option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Months";
  monthSelect.appendChild(defaultOption);

  // Add dynamic months
  computedStore.months.forEach(month => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  monthSelect.addEventListener("change", (e) => {
    const selected = e.target.value || null;
    filterStore.month = selected;

    console.log("Month selected:", selected);

    buildMasterData(selected);
  });
}
