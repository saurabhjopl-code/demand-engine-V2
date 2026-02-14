import { SHEETS } from "../config/sheet.config.js";
import { fetchCSV } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { dataStore } from "../store/data.store.js";

import { buildCoreEngine } from "../engine/core.engine.js";
import { buildAllSummaries } from "../engine/summary.index.js";

async function loadAllSheets() {

  for (const key in SHEETS) {

    const text = await fetchCSV(SHEETS[key]);
    dataStore[key] = parseCSV(text);
  }
}

async function bootstrap() {

  // 1️⃣ Load raw sheets
  await loadAllSheets();

  // 2️⃣ Build Master Engine
  buildCoreEngine();

  // 3️⃣ Build Summaries
  buildAllSummaries();

  console.log("Master:", dataStore);
  console.log("Computed:", buildCoreEngine);
}

bootstrap();
