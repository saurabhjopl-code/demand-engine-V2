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

  const selectedDays =
    computedStore.reports?.sizeCurve?.selectedDays || 45;

  reportHeader.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Size Curve Recommendation (Seller Stock Basis)</div>
      <div>
        <span style="font-size:13px;">SC Days:</span>
        <select id="sizeCurveDaysSelector" class="sc-select">
          <option value="45" ${selectedDays==45?"selected":""}>45D</option>
          <option value="60" ${selectedDays==60?"selected":""}>60D</option>
          <option value="90" ${selectedDays==90?"selected":""}>90D</option>
          <option value="120" ${selectedDays==120?"selected":""}>120D</option>
        </select>
      </div>
    </div>
  `;

  const data = computedStore.reports.sizeCurve.rows || [];

  if (!data.length) {
    reportBody.innerHTML =
      "<div style='padding:20px;'>No Styles Require Replenishment</div>";
    return;
  }

  let html = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Demand</th>
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
    .getElementById("sizeCurveDaysSelector")
    .addEventListener("change", (e) => {
      buildSizeCurve(Number(e.target.value));
      renderSizeCurve();
    });
}
