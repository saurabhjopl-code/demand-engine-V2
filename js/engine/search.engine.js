import { computedStore } from "../store/computed.store.js";

export function applySearch(query) {

  if (!query || !query.trim()) {
    computedStore.filteredSKU = computedStore.masterSKU || [];
    return;
  }

  const q = query.trim().toLowerCase();

  computedStore.filteredSKU = (computedStore.masterSKU || []).filter(item => {

    const skuMatch =
      item.uniwareSku?.toLowerCase().includes(q);

    const styleMatch =
      item.styleId?.toLowerCase().includes(q);

    return skuMatch || styleMatch;
  });
}
