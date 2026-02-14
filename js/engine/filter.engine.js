import { computedStore } from "../store/computed.store.js";

export function applyFilters() {

  const { filters, masterDataSKU, masterDataStyle } = computedStore;

  // SEARCH OVERRIDE MODE
  if (filters.search && filters.search.trim() !== "") {

    const text = filters.search.toLowerCase();

    const skuFiltered = masterDataSKU.filter(sku =>
      sku.uniwareSku.toLowerCase().includes(text) ||
      sku.styleId.toLowerCase().includes(text) ||
      sku.category.toLowerCase().includes(text) ||
      sku.remark.toLowerCase().includes(text)
    );

    const styleIds = new Set(skuFiltered.map(s => s.styleId));

    computedStore.filteredSKU = skuFiltered;
    computedStore.filteredStyle = masterDataStyle
      .filter(style => styleIds.has(style.styleId));

    return;
  }

  // NORMAL FILTER MODE

  let filteredStyle = [...masterDataStyle];

  if (filters.category) {
    filteredStyle = filteredStyle.filter(s => s.category === filters.category);
  }

  if (filters.remark) {
    filteredStyle = filteredStyle.filter(s => s.remark === filters.remark);
  }

  if (filters.scBand) {
    filteredStyle = filteredStyle.filter(s => s.scBand === filters.scBand);
  }

  const allowedStyleIds = new Set(filteredStyle.map(s => s.styleId));

  let filteredSKU = masterDataSKU.filter(sku =>
    allowedStyleIds.has(sku.styleId)
  );

  if (filters.fc) {
    filteredSKU = filteredSKU.filter(sku =>
      sku.stockByFC[filters.fc] > 0
    );
  }

  computedStore.filteredSKU = filteredSKU;
  computedStore.filteredStyle = filteredStyle;
}
