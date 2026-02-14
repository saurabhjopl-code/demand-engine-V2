import { computedStore } from "../../store/computed.store.js";

export function buildCompanyRemark() {

  const master = computedStore.master;
  if (!master) return;

  const remarkMap = {};

  Object.values(master.styles).forEach(style => {

    const remark = style.remark || "-";

    if (!remarkMap[remark]) {
      remarkMap[remark] = 0;
    }

    remarkMap[remark] += style.totalSales;
  });

  computedStore.summaries.companyRemark = remarkMap;
}
