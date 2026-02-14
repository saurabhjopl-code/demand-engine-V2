import { loadAllSheets } from "./lifecycle.js";

document.addEventListener("DOMContentLoaded", () => {

  const refreshBtn = document.querySelector(".btn-secondary");

  refreshBtn.addEventListener("click", async () => {
    try {
      await loadAllSheets();
      console.log("All sheets loaded and validated.");
    } catch (err) {
      console.error(err.message);
    }
  });

});
