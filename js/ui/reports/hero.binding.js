import { computedStore } from "../../store/computed.store.js";
import { applyGlobalSearch } from "../../utils/search.utils.js";

function getRemarkClass(remark) {

  if (!remark) return "";

  const r = remark.toLowerCase();

  if (r.includes("core")) return "remark-core";
  if (r.includes("new")) return "remark-new";
  if (r.includes("clear")) return "remark-clear";
  if (r.includes("test")) return "remark-test";

  return "remark-default";
}

export function renderHero() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>Hero Report</div>
      <div style="font-size:12px; opacity:0.7;">
        Top 20 (Latest Month Rank)
      </div>
    </div>
  `;

  let data = computedStore.hero || [];

  data = applyGlobalSearch(data, ["style"]);

  if (!data.length) {
    body.innerHTML = "<div style='padding:20px;'>No Hero Data</div>";
    return;
  }

  const months = data[0].months;

  let html = `
    <table class="report-table">
      <thead>
        <tr>
          <th rowspan="2">Style ID</th>
          <th colspan="3">Sale</th>
          <th colspan="3">Rank</th>
          <th colspan="3">DRR</th>
          <th rowspan="2">SC</th>
          <th rowspan="2">Broken</th>
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

    const remarkClass = getRemarkClass(row.remark);

    html += `
      <tr>
        <td>${row.style}</td>

        ${months.map(m => `<td>${row.sales[m]}</td>`).join("")}
        ${months.map(m => `<td>${row.ranks[m]}</td>`).join("")}
        ${months.map(m => `<td>${row.drr[m].toFixed(2)}</td>`).join("")}

        <td>${row.sc}</td>
        <td>${row.broken}</td>
        <td class="${remarkClass}">${row.remark || ""}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  body.innerHTML = html;
}
