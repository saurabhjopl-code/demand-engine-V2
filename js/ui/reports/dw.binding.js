import { computedStore } from "../../store/computed.store.js";
import { formatNumber } from "../../utils/formatter.js";

export function renderDW() {

  const header = document.querySelector(".report-header");
  const body = document.querySelector(".report-body");

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>DW (Demand Weight) Report</div>
      <div style="font-size:12px; opacity:0.7;">
        Sorted by Latest Month DW
      </div>
    </div>
  `;

  const data = computedStore.dw || [];

  if (!data.length) {
    body.innerHTML = "<div style='padding:20px;'>No DW Data</div>";
    return;
  }

  const months = data[0].months;

  let html = `
    <table class="report-table">
      <thead>
        <tr>
          <th rowspan="2">Style</th>
          <th colspan="3">DW (%)</th>
          <th colspan="3">Sale</th>
          <th rowspan="2">${months[0]} → ${months[1]}</th>
          <th rowspan="2">${months[1]} → ${months[2]}</th>
        </tr>
        <tr>
          ${months.map(m => `<th>${m}</th>`).join("")}
          ${months.map(m => `<th>${m}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
  `;

  function getClass(movement) {
    if (movement === "Improved") return "text-green";
    if (movement === "Dropped") return "text-red";
    if (movement === "New") return "text-blue";
    if (movement === "Dropped Out") return "text-orange";
    return "";
  }

  data.forEach(row => {

    html += `
      <tr>
        <td>${row.style}</td>

        ${months.map(m => `<td>${row.dw[m].toFixed(2)}%</td>`).join("")}
        ${months.map(m => `<td>${formatNumber(row.sales[m])}</td>`).join("")}

        <td class="${getClass(row.movement1)}">${row.movement1}</td>
        <td class="${getClass(row.movement2)}">${row.movement2}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  body.innerHTML = html;
}
