import { computedStore } from "../../store/computed.store.js";

export function renderFcStock() {

  const data = computedStore.summaries.fcStock;
  const card = document.querySelectorAll(".card")[1];

  card.querySelector(".card-body").innerHTML = `
    <div>Total Stock: <strong>${data.totalStock}</strong></div>
    <div>Total Production: <strong>${data.totalProduction}</strong></div>
  `;
}
