import { computedStore } from "../../store/computed.store.js";

export function renderSaleDetails() {

  const data = computedStore.summaries.saleDetails;
  const card = document.querySelectorAll(".card")[0];

  card.querySelector(".card-body").innerHTML = `
    <div>Total Sales: <strong>${data.totalSales}</strong></div>
    <div>Total Styles: <strong>${data.totalStyles}</strong></div>
    <div>Total SKUs: <strong>${data.totalSkus}</strong></div>
  `;
}
