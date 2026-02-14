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

  const rows = data.rows;

  let html = `
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
  `;

  let currentCategory = null;
  let categoryRowCount = 0;

  // Count rows per category
  const categoryCounts = {};
  rows.forEach(row => {
    categoryCounts[row.category] =
      (categoryCounts[row.category] || 0) + 1;
  });

  rows.forEach((row, index) => {

    html += `<tr>`;

    // Size column
    html += `<td>${row.size}</td>`;

    // If first row of category → show category cells with rowspan
    if (row.category !== currentCategory) {

      currentCategory = row.category;
      categoryRowCount = categoryCounts[row.category];

      html += `
        <td rowspan="${categoryRowCount}">${row.category}</td>
        <td>${formatNumber(row.units)}</td>
        <td rowspan="${categoryRowCount}">
          ${formatNumber(row.totalCategoryUnits)}
        </td>
        <td>${formatPercent(row.sizeShare)}</td>
        <td rowspan="${categoryRowCount}">
          ${formatPercent(row.categoryShare)}
        </td>
        <td>${formatNumber(row.stockUnits)}</td>
        <td rowspan="${categoryRowCount}">
          ${formatNumber(row.totalCategoryStock)}
        </td>
      `;

    } else {

      html += `
        <td>${formatNumber(row.units)}</td>
        <td>${formatPercent(row.sizeShare)}</td>
        <td>${formatNumber(row.stockUnits)}</td>
      `;
    }

    html += `</tr>`;
  });

  html += `
    <tr class="grand-row">
      <td colspan="2"><strong>Grand Total</strong></td>
      <td><strong>${formatNumber(data.grandUnits)}</strong></td>
      <td colspan="3"></td>
      <td><strong>${formatNumber(data.grandStock)}</strong></td>
      <td></td>
    </tr>
  `;

  html += `
      </tbody>
    </table>
  `;

  body.innerHTML = html;
}
