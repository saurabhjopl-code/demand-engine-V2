import { computedStore } from "../../store/computed.store.js";

export function renderCategory() {

  const data = computedStore.summaries.category;
  const card = document.querySelectorAll(".card")[5];

  card.querySelector(".card-body").innerHTML = `
    ${Object.entries(data).map(
      ([category, sales]) => `<div>${category}: <strong>${sales}</strong></div>`
    ).join("")}
  `;
}
