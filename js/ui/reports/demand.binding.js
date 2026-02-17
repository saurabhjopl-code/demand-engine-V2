import { computedStore } from "../../store/computed.store.js";
import { buildDemand } from "../../engine/reports/demand.engine.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

let expandedStyles = new Set();

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

function formatDecimal(num) {
  return num.toFixed(2);
}

function getScClass(sc) {
  if (sc < 30) return "sc-critical";
  if (sc < 45) return "sc-risk";
  if (sc < 60) return "sc-healthy";
  if (sc < 90) return "sc-safe";
  if (sc < 120) return "sc-watch";
  return "sc-overstock";
}

export function renderDemand() {

  const reportBody = document.querySelector(".report-body");
  const reportHeader = document.querySelector(".report-header");

  const reportData = computedStore.reports?.demand;

  const selectedDays = reportData?.selectedDays || 45;
  const stockMode = reportData?.stockMode || "total";

  reportHeader.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Demand Report</div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div>
          <span style="font-size:13px;">SC Days:</span>
          <select id="scDaySelector" class="sc-select">
            <option value="45" ${selectedDays==45?"selected":""}>45D</option>
            <option value="60" ${selectedDays==60?"selected":""}>60D</option>
            <option value="90" ${selectedDays==90?"selected":""}>90D</option>
            <option value="120" ${selectedDays==120?"selected":""}>120D</option>
          </select>
        </div>
        <div>
          <span style="font-size:13px;">Stock Basis:</span>
          <select id="stockModeSelector" class="sc-select">
            <option value="total" ${stockMode==="total"?"selected":""}>Total Stock</option>
            <option value="seller" ${stockMode==="seller"?"selected":""}>Seller Stock</option>
          </select>
        </div>
      </div>
    </div>
  `;

  let rows = reportData.rows;

  rows = applyGlobalSearch(rows, ["styleId"]);

  let html = `
    <table class="summary-table">
     <thead>
    <tr>
    <th></th>
    <th>Style ID</th>
    <th>Category</th>
    <th>Remark</th>
    <th>Total Sales</th>
    <th>Stock</th>
    <th>DRR</th>
    <th>SC</th>
    <th>Req Demand</th>
    <th>Direct Demand</th>
    <th>Under Production</th>
    <th>Pending</th>
    </tr>
</thead>

      <tbody>
  `;

  rows.forEach(row => {

    const isExpanded = expandedStyles.has(row.styleId);
    const scClass = getScClass(row.sc);

    html += `
     <tr class="style-row ${scClass}" data-style="${row.styleId}">
  <td>${row.skus.length ? (isExpanded ? "▼" : "▶") : ""}</td>
  <td><strong>${row.styleId}</strong></td>
  <td>${row.category}</td>
  <td>${row.remark}</td>
  <td>${formatNumber(row.totalSales)}</td>
  <td>${formatNumber(row.totalStock)}</td>
  <td>${formatDecimal(row.drr)}</td>
  <td>${Math.round(row.sc)}</td>
  <td>${formatNumber(row.requiredDemand)}</td>
  <td>${formatNumber(row.directDemand)}</td>
  <td>${formatNumber(row.production)}</td>
  <td>${formatNumber(row.pending)}</td>
</tr>

    `;

    if (isExpanded) {

      const filteredSkus = applyGlobalSearch(row.skus, ["sku"]);

      filteredSkus.forEach(sku => {

        html += `
          <tr class="sku-row">
            <td></td>
            <td style="padding-left:20px;">${sku.sku}</td>
            <td>${formatNumber(sku.totalSales)}</td>
            <td>${formatNumber(sku.totalStock)}</td>
            <td>${formatDecimal(sku.drr)}</td>
            <td>${Math.round(sku.sc)}</td>
            <td>${formatNumber(sku.requiredDemand)}</td>
            <td>${formatNumber(sku.directDemand)}</td>
            <td>${formatNumber(sku.production)}</td>
            <td>${formatNumber(sku.pending)}</td>
          </tr>
        `;
      });
    }
  });

  html += `</tbody></table>`;
  reportBody.innerHTML = html;

  document.querySelectorAll(".style-row").forEach(row => {
    row.addEventListener("click", () => {
      const styleId = row.dataset.style;
      expandedStyles.has(styleId)
        ? expandedStyles.delete(styleId)
        : expandedStyles.add(styleId);
      renderDemand();
    });
  });

  document.getElementById("scDaySelector")
    .addEventListener("change", (e) => {
      buildDemand(Number(e.target.value), stockMode);
      renderDemand();
    });

  document.getElementById("stockModeSelector")
    .addEventListener("change", (e) => {
      buildDemand(selectedDays, e.target.value);
      renderDemand();
    });
}

