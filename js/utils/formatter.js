// js/utils/formatter.js

export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  return Number(value).toLocaleString("en-IN");
}

export function formatDecimal(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  return Number(value).toFixed(decimals);
}
