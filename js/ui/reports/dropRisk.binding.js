import { computedStore } from "../../store/computed.store.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

function formatDecimal(num) {
  return num.toFixed(2);
}

function getRiskClass(risk) {

  if (risk === "High Overstock Risk")
    return "risk-red";

  if (risk === "Stock Building")
    return "risk-orange";

  if (risk === "Early Weakness")
    return "risk-yellow";

  return "";
}

export function renderDropRisk() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  const report = computedStore.reports?.dropRisk;

  if (!report || !report.rows.length) {
    body.innerHTML = "<div style='padding:20px;'>No Drop Risk Data</div>";
    return;
  }

  const { rows, currentMonth, previousMonth, showOnlyMajor } = report;

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>🛡️ DRR Drop Risk</div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="font-size:12px; opacity:0.7;">
          ${previousMonth} → ${currentMonth}
        </div>
        <label style="font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" id="dropToggle"
            ${showOnlyMajor ? "checked" : ""} />
          Show Only >10%
        </label>
      </div>
    </div>
  `;

  let data = applyGlobalSearch(rows, ["styleId"]);

  if (showOnlyMajor) {
    data = data.filter(r => r.drop > 10);
  }

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Category</th>
          <th>DRR (${previousMonth})</th>
          <th>DRR (${currentMonth})</th>
          <th>Drop %</th>
          <th>SC</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {

    html += `
      <tr>
        <td>${row.styleId}</td>
        <td>${row.category}</td>
        <td>${formatDecimal(row.previousDRR)}</td>
        <td>${formatDecimal(row.currentDRR)}</td>
        <td class="text-red">${formatDecimal(row.drop)}%</td>
        <td>${formatDecimal(row.sc)}</td>
        <td class="${getRiskClass(row.risk)}">
          ${row.risk}
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  body.innerHTML = html;

  document.getElementById("dropToggle")
    .addEventListener("change", (e) => {

      computedStore.reports.dropRisk.showOnlyMajor =
        e.target.checked;

      renderDropRisk();
    });
}
