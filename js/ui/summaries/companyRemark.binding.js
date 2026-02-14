import { computedStore } from "../../store/computed.store.js";

export function renderCompanyRemark() {

  const data = computedStore.summaries.companyRemark;
  const card = document.querySelectorAll(".card")[3];

  card.querySelector(".card-body").innerHTML = `
    ${Object.entries(data).map(
      ([remark, sales]) => `<div>${remark}: <strong>${sales}</strong></div>`
    ).join("")}
  `;
}
