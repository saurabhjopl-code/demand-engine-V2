import { computedStore } from "../../store/computed.store.js";
import { buildBroken } from "../../engine/reports/broken.engine.js";

let expandedStyles = new Set();

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

export function renderBroken() {

  const reportBody = document.querySelector(".report-body");
  const reportHeader = document.querySelector(".report-header");

  reportHeader.innerHTML = `<div>Broken Report (Stock ≤ 5)</div>`;

  const data = computedStore.reports.broken;

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th></th>
          <th>Style ID</th>
          <th>Category</th>
          <th>Remark</th>
          <th>Total Sales</th>
          <th>Total Stock</th>
          <th>Broken Sizes</th>
          <th>Healthy Sizes</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.rows.forEach(row => {

    const isExpanded = expandedStyles.has(row.styleId);

    html += `
      <tr class="style-row" data-style="${row.styleId}">
        <td>${isExpanded ? "▼" : "▶"}</td>
        <td><strong>${row.styleId}</strong></td>
        <td>${row.category}</td>
        <td>${row.remark}</td>
        <td>${formatNumber(row.totalSales)}</td>
        <td>${formatNumber(row.totalStock)}</td>
        <td>${row.brokenCount}</td>
        <td>${row.healthyCount}</td>
      </tr>
    `;

    if (isExpanded) {

      SIZE_ORDER.forEach(size => {

        const sizeInfo = row.sizes[size];
        if (!sizeInfo) return;

        const stock = sizeInfo.stock || 0;
        const status = stock <= 5 ? "Broken" : "Healthy";

        html += `
          <tr class="sku-row">
            <td></td>
            <td style="padding-left:20px;">${size}</td>
            <td colspan="2"></td>
            <td>${formatNumber(sizeInfo.sales)}</td>
            <td>${formatNumber(stock)}</td>
            <td colspan="2">${status}</td>
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
      if (expandedStyles.has(styleId)) {
        expandedStyles.delete(styleId);
      } else {
        expandedStyles.add(styleId);
      }
      renderBroken();
    });
  });
}
