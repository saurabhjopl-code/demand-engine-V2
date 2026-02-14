import { computedStore } from "../../store/computed.store.js";

function formatNumber(num) {
  return num.toLocaleString("en-IN");
}

export function renderScBand() {

  const data = computedStore.summaries.scBand;
  const card = document.querySelectorAll(".card")[2];
  const body = card.querySelector(".card-body");

  const orderedBands = ["0–30", "30–60", "60–120", "120+"];

  body.innerHTML = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>SC Band</th>
          <th># of Styles</th>
          <th>Total Units Sold</th>
          <th>Total Stock</th>
        </tr>
      </thead>
      <tbody>
        ${orderedBands.map(band => `
          <tr>
            <td>${band}</td>
            <td>${data[band].count}</td>
            <td>${formatNumber(data[band].totalUnits)}</td>
            <td>${formatNumber(data[band].totalStock)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
