import { computedStore } from "../../store/computed.store.js";
import { buildDeadStock } from "../../engine/reports/deadStock.engine.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

function getRiskClass(risk) {
  if (risk === "High Exposure") return "text-red";
  if (risk === "Moderate") return "text-orange";
  return "text-yellow";
}

export function renderDeadStock() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  const reportData = computedStore.reports?.deadStock;
  const stockMode = reportData?.stockMode || "seller";

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Dead Stock Radar</div>
      <div>
        <span style="font-size:13px;">Stock Basis:</span>
        <select id="deadStockSelector" class="sc-select">
          <option value="seller" ${stockMode==="seller"?"selected":""}>
            Seller Stock
          </option>
          <option value="total" ${stockMode==="total"?"selected":""}>
            Total Stock
          </option>
        </select>
      </div>
    </div>
  `;

  let rows = reportData?.rows || [];

  rows = applyGlobalSearch(rows, ["styleId"]);

  if (!rows.length) {
    body.innerHTML =
      "<div style='padding:20px;'>No Dead Styles Detected</div>";
    return;
  }

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Category</th>
          <th>Remark</th>
          <th>Stock</th>
          <th>SC</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach(r => {

    html += `
      <tr>
        <td><strong>${r.styleId}</strong></td>
        <td>${r.category}</td>
        <td>${r.remark}</td>
        <td>${formatNumber(r.stock)}</td>
        <td>${r.sc.toFixed(1)}</td>
        <td class="${getRiskClass(r.risk)}">
          ${r.risk}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  body.innerHTML = html;

  document
    .getElementById("deadStockSelector")
    .addEventListener("change", (e) => {
      buildDeadStock(e.target.value);
      renderDeadStock();
    });
}
