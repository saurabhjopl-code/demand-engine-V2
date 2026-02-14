import { computedStore } from "../../store/computed.store.js";
import { formatNumber } from "../../utils/formatter.js";
import { getSCClass } from "../../utils/scBand.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

export function renderBroken() {

  const container = document.querySelector(".report-body");

  let data = computedStore.reports?.broken || [];

  // 🔎 APPLY GLOBAL SEARCH (Style ID only)
  data = applyGlobalSearch(data, ["styleId"]);

  document.querySelector(".report-header").innerHTML = `
    Broken Report
  `;

  if (data.length === 0) {
    container.innerHTML = `<div class="no-data">No Broken Styles Found</div>`;
    return;
  }

  let html = `
    <div class="report-table-wrapper">
      <table class="report-table">
        <thead>
          <tr>
            <th>Style ID</th>
            <th>Total Sizes</th>
            <th>Broken Count</th>
            <th class="left">Broken Sizes</th>
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

    html += `
      <tr>
        <td class="style">${row.styleId}</td>
        <td>${row.totalSizes}</td>
        <td>${row.brokenCount}</td>
        <td class="left wrap">${row.brokenSizes}</td>
        <td>${formatNumber(row.totalSale)}</td>
        <td>${formatNumber(row.totalStock)}</td>
        <td>${row.drr.toFixed(2)}</td>
        <td class="${getSCClass(row.sc)}">${row.sc.toFixed(1)}</td>
        <td class="remark ${row.remark.toLowerCase()}">${row.remark}</td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;

  container.innerHTML = html;
}
