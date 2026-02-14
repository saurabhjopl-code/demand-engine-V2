export const computedStore = {

  // Master (never mutated)
  masterDataSKU: [],
  masterDataStyle: [],
  skuMap: {},
  styleMap: {},
  months: [],
  saleDaysMap: {},

  // Filtered (used by summaries/reports)
  filteredSKU: [],
  filteredStyle: [],

  // Filter State
  filters: {
    month: null,
    fc: null,
    category: null,
    remark: null,
    scBand: null,
    search: ""
  }
};
