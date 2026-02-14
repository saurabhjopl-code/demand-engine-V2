import { SHEETS } from "../config/sheet.config.js";
import { fetchCSV } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { dataStore } from "../store/data.store.js";

import { buildCoreEngine } from "../engine/core.engine.js";
import { buildAllSummaries } from "../engine/summary.index.js";

import { renderAllSummaries } from "../ui/summary.index.js";

async function loadAllSheets() {

  for (const key in SHEETS) {
    const text = await fetchCSV(SHEETS[key]);
    dataStore[key] = parseCSV(text);
  }
}

async function bootstrap() {

  await loadAllSheets();

  buildCoreEngine();
  buildAllSummaries();

  renderAllSummaries();

  console.log("App Ready");
}

bootstrap();
