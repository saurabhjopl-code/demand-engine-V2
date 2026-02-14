import { computedStore } from "../../store/computed.store.js";
import { formatNumber } from "../../utils/formatter.js";

export function renderHero() {

  const container = document.querySelector(".report-body");
  const data = computedStore.hero;

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No Hero Styles Found</p>";
    return;
  }

  const months = data[0].months;

  let html = `
  <div class="report-title">Hero Report</div>
  <div class="table-wrapper">
  <table class="report-table">
    <thead>
      <tr>
        <th rowspan="2">Style ID</th>
        <th colspan="3">Sale</th>
        <th colspan="3">Rank</th>
        <th colspan="3">DRR</th>
        <th rowspan="2">SC (Seller)</th>
        <th rowspan="2">Broken</th>
        <th rowspan="2">Remark</th>
      </tr>
      <tr>
        <th>${months[0]}</th>
        <th>${months[1]}</th>
        <th>${months[2]}</th>
        <th>${months[0]}</th>
        <th>${months[1]}</th>
        <th>${months[2]}</th>
        <th>${months[0]}</th>
        <th>${months[1]}</th>
        <th>${months[2]}</th>
      </tr>
    </thead>
    <tbody>
  `;

  data.forEach(row => {

    const remarkClass =
      row.remark === "Rank Improved" ? "green" :
      row.remark === "Rank Dropped" ? "orange" :
      row.remark === "DRR Dropped" ? "red" :
      row.remark === "New Addition" ? "blue" : "";

    html += `
      <tr>
        <td>${row.style}</td>
        <td>${formatNumber(row.sales[months[0]])}</td>
        <td>${formatNumber(row.sales[months[1]])}</td>
        <td>${formatNumber(row.sales[months[2]])}</td>

        <td>${row.ranks[months[0]]}</td>
        <td>${row.ranks[months[1]]}</td>
        <td>${row.ranks[months[2]]}</td>

        <td>${row.drr[months[0]].toFixed(2)}</td>
        <td>${row.drr[months[1]].toFixed(2)}</td>
        <td>${row.drr[months[2]].toFixed(2)}</td>

        <td>${row.sc}</td>
        <td>${row.broken}</td>
        <td class="${remarkClass}">${row.remark}</td>
      </tr>
    `;
  });

  html += "</tbody></table></div>";

  container.innerHTML = html;
}
