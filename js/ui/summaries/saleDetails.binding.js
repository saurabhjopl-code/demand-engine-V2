import { computedStore } from "../../store/computed.store.js";

function formatNumber(num) {
  return num.toLocaleString("en-IN");
}

function formatDecimal(num) {
  return num.toFixed(2);
}

export function renderSaleDetails() {

  const data = computedStore.summaries.saleDetails;
  const card = document.querySelectorAll(".card")[0];
  const body = card.querySelector(".card-body");

  body.innerHTML = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows.map(row => `
          <tr>
            <td>${row.month}</td>
            <td>${formatNumber(row.totalUnits)}</td>
            <td>${formatDecimal(row.drr)}</td>
          </tr>
        `).join("")}
        <tr class="grand-row">
          <td><strong>Grand Total</strong></td>
          <td><strong>${formatNumber(data.grandTotalUnits)}</strong></td>
          <td><strong>${formatDecimal(data.grandDRR)}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}
