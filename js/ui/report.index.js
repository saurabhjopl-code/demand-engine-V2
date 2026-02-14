import { renderDemand } from "./reports/demand.binding.js";
import { renderOverstock } from "./reports/overstock.binding.js";

export function renderAllReports() {
  renderDemand();
}
