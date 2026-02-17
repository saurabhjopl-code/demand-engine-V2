import { computedStore } from "../../store/computed.store.js";
import { buildHero } from "../../engine/reports/hero.engine.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

export function renderHero() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  const meta = computedStore.heroMeta || {};
  const topN = meta.topN || 20;

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Hero Report</div>
      <div>
        <span style="font-size:13px;">Top:</span>
        <select id="heroTopSelector" class="sc-select">
          <option value="20" ${topN==20?"selected":""}>20</option>
          <option value="25" ${topN==25?"selected":""}>25</option>
          <option value="50" ${topN==50?"selected":""}>50</option>
          <option value="100" ${topN==100?"selected":""}>100</option>
        </select>
      </div>
    </div>
  `;

  let data = computedStore.hero || [];
  data = applyGlobalSearch(data, ["style"]);

  if (!data.length) {
    body.innerHTML = "<div style='padding:20px;'>No Hero Data</div>";
    return;
  }

  const months = meta.months;

  let html = `
    <table class="report-table">
      <thead>
        <tr>
          <th rowspan="2">Style ID</th>
          <th colspan="${months.length}">Sale</th>
          <th colspan="${months.length}">Rank</th>
          <th colspan="${months.length}">DRR</th>
          <th rowspan="2">Remark</th>
        </tr>
        <tr>
          ${months.map(m => `<th>${m}</th>`).join("")}
          ${months.map(m => `<th>${m}</th>`).join("")}
          ${months.map(m => `<th>${m}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {

    html += `
      <tr>
        <td>${row.style}</td>

        ${months.map(m => `<td>${row.sales[m]}</td>`).join("")}
        ${months.map(m => `<td>${row.ranks[m]}</td>`).join("")}
        ${months.map(m => `<td>${row.drr[m].toFixed(2)}</td>`).join("")}

        <td class="remark-${row.remarkType}">
          ${row.remarkText}
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  body.innerHTML = html;

  document.getElementById("heroTopSelector")
    .addEventListener("change", (e) => {
      buildHero(Number(e.target.value));
      renderHero();
    });
}
