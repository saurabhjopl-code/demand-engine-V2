import { buildDemand } from "./reports/demand.engine.js";
import { buildOverstock } from "./reports/overstock.engine.js";

export function buildAllReports() {
  buildDemand(45);
  buildOverstock(90);
}
