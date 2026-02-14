import { computedStore } from "../../store/computed.store.js";
import { buildDemand } from "../../engine/reports/demand.engine.js";

let expandedStyles = new Set();

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

function formatDecimal(num) {
  return num.toFixed(2);
}

export function renderDemand() {

  const reportBody = document.querySelector(".report-body");
  const reportHeader = document.querySelector(".report-header");

  const selectedDays =
    computedStore.reports?.demand?.selectedDays || 45;

  reportHeader.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Demand Report</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:13px;">SC Days:</span>
        <select id="scDaySelector" class="sc-select">
          <option value="45" ${selectedDays==45?"selected":""}>45D</option>
          <option value="60" ${selectedDays==60?"selected":""}>60D</option>
          <option value="90" ${selectedDays==90?"selected":""}>90D</option>
          <option value="120" ${selectedDays==120?"selected":""}>120D</option>
        </select>
      </div>
    </div>
  `;

  const data = computedStore.reports.demand;

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

  data.rows.forEach(row => {

    const isExpanded = expandedStyles.has(row.styleId);

    html += `
      <tr class="style-row" data-style="${row.styleId}">
        <td>${row.skus.length > 0 ? (isExpanded ? "▼" : "▶") : ""}</td>
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

      row.skus.forEach(sku => {

        html += `
          <tr class="sku-row">
            <td></td>
            <td style="padding-left:20px;">${sku.sku}</td>
            <td colspan="2"></td>
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

  // Expand toggle
  document.querySelectorAll(".style-row").forEach(row => {

    row.addEventListener("click", () => {

      const styleId = row.dataset.style;

      if (expandedStyles.has(styleId)) {
        expandedStyles.delete(styleId);
      } else {
        expandedStyles.add(styleId);
      }

      renderDemand();
    });
  });

  document
    .getElementById("scDaySelector")
    .addEventListener("change", (e) => {

      const days = Number(e.target.value);
      buildDemand(days);
      renderDemand();
    });
}
