import { progressStore } from "../store/progress.store.js";

export function updateProgressUI() {

  const bar = document.querySelector(".progress-bar");
  const statusText = document.querySelector(".progress-left div:first-child");
  const sheetCounts = document.querySelector(".sheet-counts");

  bar.style.width = progressStore.percent + "%";
  statusText.textContent = `${progressStore.percent}% • ${progressStore.current}`;

  let countText = "";
  for (const key in progressStore.rowCounts) {
    countText += `${key}: ${progressStore.rowCounts[key]} | `;
  }

  sheetCounts.textContent = countText.slice(0, -3);
}
