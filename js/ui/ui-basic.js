import { computedStore } from "../store/computed.store.js";

export function initMonthFilter(callback) {

  const monthSelect = document.querySelector("#monthFilter");

  if (!monthSelect) return;

  // Populate months
  const months = computedStore.months || [];

  monthSelect.innerHTML = `<option value="">All</option>`;

  months.forEach(m => {
    monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
  });

  monthSelect.addEventListener("change", (e) => {
    const selectedMonth = e.target.value || null;

    console.log("Month selected:", selectedMonth);

    callback(selectedMonth);
  });
}
