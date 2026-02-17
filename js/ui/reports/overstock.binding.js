import { computedStore } from "../../store/computed.store.js";
import { buildOverstock } from "../../engine/reports/overstock.engine.js";

let expandedStyles = new Set();

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

function formatDecimal(num) {
  return num.toFixed(2);
}

export function renderOverstock() {

  const reportBody = document.querySelector(".report-body");
  const reportHeader = document.querySelector(".report-header");

  const reportData = computedStore.reports?.overstock;

  const threshold = reportData?.threshold || 90;
  const stockMode = reportData?.stockMode || "total";

  reportHeader.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Overstock Report</div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div>
          <span style="font-size:13px;">SC Threshold:</span>
          <select id="overstockSelector" class="sc-select">
            <option value="60" ${threshold==60?"selected":""}>60</option>
            <option value="90" ${threshold==90?"selected":""}>90</option>
            <option value="120" ${threshold==120?"selected":""}>120</option>
            <option value="150" ${threshold==150?"selected":""}>150</option>
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

  const data = reportData.rows;

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
          <th>Excess Units</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {

    const isExpanded = expandedStyles.has(row.styleId);

    html += `
      <tr class="style-row" data-style="${row.styleId}">
        <td>${row.skus.length ? (isExpanded ? "▼" : "▶") : ""}</td>
        <td><strong>${row.styleId}</strong></td>
        <td>${row.category}</td>
        <td>${row.remark}</td>
        <td>${formatNumber(row.totalSales)}</td>
        <td>${formatNumber(row.stock)}</td>
        <td>${formatDecimal(row.drr)}</td>
        <td>${Math.round(row.sc)}</td>
        <td>${formatNumber(row.excessUnits)}</td>
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
            <td>${formatNumber(sku.stock)}</td>
            <td>${formatDecimal(sku.drr)}</td>
            <td>${Math.round(sku.sc)}</td>
            <td>${formatNumber(sku.excessUnits)}</td>
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
      renderOverstock();
    });
  });

  document.getElementById("overstockSelector")
    .addEventListener("change", (e) => {
      buildOverstock(Number(e.target.value), stockMode);
      renderOverstock();
    });

  document.getElementById("stockModeSelector")
    .addEventListener("change", (e) => {
      buildOverstock(threshold, e.target.value);
      renderOverstock();
    });
}
