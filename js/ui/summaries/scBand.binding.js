import { computedStore } from "../../store/computed.store.js";

export function renderScBand() {

  const data = computedStore.summaries.scBand;
  const card = document.querySelectorAll(".card")[2];

  card.querySelector(".card-body").innerHTML = `
    ${Object.entries(data).map(
      ([band, count]) => `<div>${band}: <strong>${count}</strong></div>`
    ).join("")}
  `;
}
