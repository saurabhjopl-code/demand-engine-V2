import { computedStore } from "../../store/computed.store.js";

function formatNumber(num) {
  return num.toLocaleString("en-IN");
}

function formatPercent(num) {
  return num.toFixed(2) + "%";
}

export function renderSizeWise() {

  const data = computedStore.summaries.sizeWise;
  const card = document.querySelectorAll(".card")[4];
  const body = card.querySelector(".card-body");

  body.innerHTML = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Size</th>
          <th>Category</th>
          <th>Units Sold</th>
          <th>Total Units Sold</th>
          <th>Size % Share</th>
          <th>Category % Share</th>
          <th>Units in Stock</th>
          <th>Total Stock</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows.map(row => `
          <tr>
            <td>${row.size}</td>
            <td>${row.category}</td>
            <td>${formatNumber(row.units)}</td>
            <td>${formatNumber(row.totalCategoryUnits)}</td>
            <td>${formatPercent(row.sizeShare)}</td>
            <td>${formatPercent(row.categoryShare)}</td>
            <td>${formatNumber(row.stockUnits)}</td>
            <td>${formatNumber(row.totalCategoryStock)}</td>
          </tr>
        `).join("")}
        <tr class="grand-row">
          <td colspan="2"><strong>Grand Total</strong></td>
          <td><strong>${formatNumber(data.grandUnits)}</strong></td>
          <td></td>
          <td></td>
          <td></td>
          <td><strong>${formatNumber(data.grandStock)}</strong></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  `;
}
