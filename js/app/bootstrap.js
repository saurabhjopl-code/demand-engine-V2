import { loadAllSheets } from "./lifecycle.js";

document.addEventListener("DOMContentLoaded", () => {

  const refreshBtn = document.querySelector(".btn-secondary");

  refreshBtn.addEventListener("click", async () => {
    try {
      await loadAllSheets();
      console.log("Data Reloaded Successfully");
    } catch (err) {
      console.error("Loader Error:", err.message);
    }
  });

  // Auto load once
  loadAllSheets().catch(err => {
    console.error("Auto load failed:", err.message);
  });

});
