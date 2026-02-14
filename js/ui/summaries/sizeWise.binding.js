import { computedStore } from "../../store/computed.store.js";

export function renderSizeWise() {

  const data = computedStore.summaries.sizeWise;
  const card = document.querySelectorAll(".card")[4];

  card.querySelector(".card-body").innerHTML = `
    ${Object.entries(data).map(
      ([size, sales]) => `<div>${size}: <strong>${sales}</strong></div>`
    ).join("")}
  `;
}
