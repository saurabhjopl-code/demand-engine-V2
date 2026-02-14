// js/ui/reports/broken.binding.js

import { computedStore } from "../../store/computed.store.js";
import { formatNumber, formatDecimal } from "../../utils/formatter.js";

export function renderBroken() {

  const container = document.querySelector(".report-body");
  const data = computedStore.reports.broken || [];

  if (!data.length) {
    container.innerHTML = "<div class='no-data'>No Broken Styles Found</div>";
    return;
  }

  let html = `
    <table class="report-table">
      <thead>
        <tr>
          <th>Style ID</th>
          <th>Total Sizes</th>
          <th>Broken Count</th>
          <th>Broken Sizes</th>
          <th>Total Sale</th>
          <th>Total Stock</th>
          <th>DRR</th>
          <th>SC</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {

    let remarkClass = "";
    if (row.remark === "Critical") remarkClass = "remark-critical";
    else if (row.remark === "Warning") remarkClass = "remark-warning";
    else remarkClass = "remark-good";

    html += `
      <tr>
        <td>${row.styleId}</td>
        <td class="center">${row.totalSizes}</td>
        <td class="center">${row.brokenCount}</td>
        <td>${row.brokenSizes}</td>
        <td class="right">${formatNumber(row.totalSale)}</td>
        <td class="right">${formatNumber(row.totalStock)}</td>
        <td class="right">${formatDecimal(row.drr, 2)}</td>
        <td class="right">${formatDecimal(row.sc, 1)}</td>
        <td class="${remarkClass}">${row.remark}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}
