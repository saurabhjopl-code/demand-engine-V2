import { computedStore } from "../../store/computed.store.js";
import { buildSizeCurve } from "../../engine/reports/sizeCurve.engine.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-IN");
}

export function renderSizeCurve() {

  const reportBody = document.querySelector(".report-body");
  const reportHeader = document.querySelector(".report-header");

  const viewMode =
    computedStore.reports?.sizeCurve?.viewMode || "pending";

  reportHeader.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Size Curve Recommendation</div>
      <div>
        <span style="font-size:13px;">View:</span>
        <select id="sizeCurveViewSelector" class="sc-select">
          <option value="pending" ${viewMode==="pending"?"selected":""}>
            Show Pending Only
          </option>
          <option value="all" ${viewMode==="all"?"selected":""}>
            Show All
          </option>
        </select>
      </div>
    </div>
  `;

  const data = computedStore.reports.sizeCurve.rows;

  if (!data.length) {
    reportBody.innerHTML =
      "<div style='padding:20px;'>No Size Curve Data</div>";
    return;
  }

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Style Demand</th>
  `;

  SIZE_ORDER.forEach(size => {
    html += `<th>${size}</th>`;
  });

  html += `
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {

    html += `
      <tr>
        <td><strong>${row.styleId}</strong></td>
        <td>${formatNumber(row.styleDemand)}</td>
    `;

    SIZE_ORDER.forEach(size => {
      html += `<td>${formatNumber(row.sizes[size] || 0)}</td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table>`;

  reportBody.innerHTML = html;

  document
    .getElementById("sizeCurveViewSelector")
    .addEventListener("change", (e) => {
      buildSizeCurve(e.target.value);
      renderSizeCurve();
    });
}
