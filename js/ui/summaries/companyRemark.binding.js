import { computedStore } from "../../store/computed.store.js";

function formatNumber(num) {
  return num.toLocaleString("en-IN");
}

function formatDecimal(num) {
  return num.toFixed(2);
}

export function renderCompanyRemark() {

  const data = computedStore.summaries.companyRemark;
  const card = document.querySelectorAll(".card")[3];
  const body = card.querySelector(".card-body");

  body.innerHTML = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Company Remark</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
          <th>Total Stock</th>
          <th>SC</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows.map(row => `
          <tr>
            <td>${row.remark}</td>
            <td>${formatNumber(row.totalUnits)}</td>
            <td>${formatDecimal(row.drr)}</td>
            <td>${formatNumber(row.totalStock)}</td>
            <td>${Math.round(row.sc)}</td>
          </tr>
        `).join("")}
        <tr class="grand-row">
          <td><strong>Grand Total</strong></td>
          <td><strong>${formatNumber(data.grandUnits)}</strong></td>
          <td><strong>${formatDecimal(data.grandDRR)}</strong></td>
          <td><strong>${formatNumber(data.grandStock)}</strong></td>
          <td><strong>${Math.round(data.grandSC)}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}
