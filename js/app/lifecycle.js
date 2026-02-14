import { SHEETS } from "../config/sheet.config.js";
import { fetchCSV } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { validateHeaders } from "../data/validator.service.js";
import { dataStore } from "../store/data.store.js";
import { progressStore } from "../store/progress.store.js";
import { updateProgressUI } from "../ui/progress.binding.js";

export async function loadAllSheets() {

  progressStore.total = SHEETS.length;
  progressStore.completed = 0;
  progressStore.percent = 0;
  progressStore.rowCounts = {};
  progressStore.current = "Starting...";

  updateProgressUI();

  for (const sheet of SHEETS) {

    progressStore.current = `Reading ${sheet.name}`;
    updateProgressUI();

    const text = await fetchCSV(sheet.url);
    const parsed = parseCSV(text);

    // Validate only for logging
    validateHeaders(parsed.headers, sheet.headers);

    dataStore[sheet.key] = parsed.data;

    progressStore.rowCounts[sheet.name] = parsed.data.length;

    progressStore.completed++;
    progressStore.percent = Math.round(
      (progressStore.completed / progressStore.total) * 100
    );

    updateProgressUI();
  }

  progressStore.current = "All Sheets Loaded Successfully";
  progressStore.percent = 100;
  updateProgressUI();
}
