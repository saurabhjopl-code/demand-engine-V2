import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

const SIZE_ORDER = [
  "FS","XS","S","M","L","XL","XXL",
  "3XL","4XL","5XL","6XL",
  "7XL","8XL","9XL","10XL"
];

function getCategory(size) {
  if (size === "FS") return "FS";
  if (["XS","S","M","L","XL","XXL"].includes(size)) return "Normal";
  if (["3XL","4XL","5XL","6XL"].includes(size)) return "PLUS 1";
  if (["7XL","8XL","9XL","10XL"].includes(size)) return "PLUS 2";
  return "-";
}

export function buildSizeWise() {

  const sales = dataStore.sales;
  const stock = dataStore.stock;

  const sizeMap = {};
  const categoryTotals = {};

  let grandUnits = 0;
  let grandStock = 0;

  SIZE_ORDER.forEach(size => {
    sizeMap[size] = {
      units: 0,
      stock: 0
    };
  });

  // Aggregate Sales
  sales.forEach(row => {
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    if (sizeMap[size]) {
      sizeMap[size].units += units;
      grandUnits += units;
    }
  });

  // Aggregate Stock
  stock.forEach(row => {
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    if (sizeMap[size]) {
      sizeMap[size].stock += units;
      grandStock += units;
    }
  });

  // Category totals
  SIZE_ORDER.forEach(size => {

    const category = getCategory(size);

    if (!categoryTotals[category]) {
      categoryTotals[category] = {
        totalUnits: 0,
        totalStock: 0
      };
    }

    categoryTotals[category].totalUnits += sizeMap[size].units;
    categoryTotals[category].totalStock += sizeMap[size].stock;
  });

  const rows = SIZE_ORDER.map(size => {

    const category = getCategory(size);

    const units = sizeMap[size].units;
    const stockUnits = sizeMap[size].stock;

    const sizeShare = grandUnits > 0
      ? (units / grandUnits) * 100
      : 0;

    const categoryShare = grandUnits > 0
      ? (categoryTotals[category].totalUnits / grandUnits) * 100
      : 0;

    return {
      size,
      category,
      units,
      totalCategoryUnits: categoryTotals[category].totalUnits,
      sizeShare,
      categoryShare,
      stockUnits,
      totalCategoryStock: categoryTotals[category].totalStock
    };
  });

  computedStore.summaries.sizeWise = {
    rows,
    grandUnits,
    grandStock
  };
}
