import { computedStore } from "../../store/computed.store.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

function formatDecimal(num) {
  return num.toFixed(2);
}

function getAccelClass(accel) {
  if (accel > 25) return "text-red";
  if (accel > 5) return "text-orange";
  if (accel < -25) return "text-blue";
  return "";
}

function getRiskClass(risk) {

  if (
    risk === "New Surge" ||
    risk === "Critical Surge"
  ) return "risk-red";

  if (risk === "Growing Opportunity")
    return "risk-orange";

  if (risk === "Early Growth")
    return "risk-yellow";

  return "";
}

export function renderSurge() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  const report = computedStore.reports?.surge;

  if (!report || !report.rows.length) {
    body.innerHTML = "<div style='padding:20px;'>No Surge Data</div>";
    return;
  }

  const { rows, currentMonth, previousMonth } = report;

  const showOnlyGrowth =
    computedStore.reports?.surge?.showOnlyGrowth || false;

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>🚀 Surge Detection</div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="font-size:12px; opacity:0.7;">
          ${previousMonth} → ${currentMonth}
        </div>
        <label style="font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" id="surgeToggle"
            ${showOnlyGrowth ? "checked" : ""} />
          Show Only >5%
        </label>
      </div>
    </div>
  `;

  let data = applyGlobalSearch(rows, ["styleId"]);

  if (showOnlyGrowth) {
    data = data.filter(r => r.accel > 5);
  }

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Category</th>
          <th>DRR (${previousMonth})</th>
          <th>DRR (${currentMonth})</th>
          <th>Accel %</th>
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
        <td class="${getAccelClass(row.accel)}">
          ${formatDecimal(row.accel)}%
        </td>
        <td>${formatDecimal(row.sc)}</td>
        <td class="${getRiskClass(row.risk)}">
          ${row.risk}
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  body.innerHTML = html;

  document.getElementById("surgeToggle")
    .addEventListener("change", (e) => {

      computedStore.reports.surge.showOnlyGrowth =
        e.target.checked;

      renderSurge();
    });
}
