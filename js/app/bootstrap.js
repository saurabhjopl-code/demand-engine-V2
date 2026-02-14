import { loadAllSheets } from "./lifecycle.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("Bootstrap loaded");

  const refreshBtn = document.querySelector(".btn-secondary");

  if (!refreshBtn) {
    console.error("Refresh button not found");
    return;
  }

  refreshBtn.addEventListener("click", async () => {
    console.log("Refresh clicked");

    try {
      await loadAllSheets();
      console.log("All sheets loaded successfully");
    } catch (error) {
      console.error("Loader Error:", error.message);
    }
  });

  // AUTO LOAD ON PAGE OPEN
  loadAllSheets().catch(err => {
    console.error("Auto load failed:", err.message);
  });

});
