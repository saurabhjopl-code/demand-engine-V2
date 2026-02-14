import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

function toNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function getSCBand(sc) {
  if (sc < 30) return "Critical";
  if (sc < 45) return "Risk";
  if (sc < 60) return "Healthy";
  if (sc < 90) return "Safe";
  if (sc < 120) return "Watch";
  return "Overstock";
}

export function buildMasterData(selectedMonth = null) {

  const sales = dataStore.sales || [];
  const stock = dataStore.stock || [];
  const styleStatus = dataStore.styleStatus || [];
  const saleDays = dataStore.saleDays || [];
  const production = dataStore.production || [];

  const skuMap = {};
  const styleMap = {};
  const monthSet = new Set();

  // ---------------- Sale Days ----------------
  const saleDaysMap = {};
  saleDays.forEach(row => {
    saleDaysMap[row["Month"]] = toNumber(row["Days"]);
  });
  computedStore.saleDaysMap = saleDaysMap;

  // ---------------- Style Info ----------------
  const styleInfo = {};
  styleStatus.forEach(row => {
    styleInfo[row["Style ID"]] = {
      category: row["Category"],
      remark: row["Company Remark"]
    };
  });

  // ---------------- Sales ----------------
  sales.forEach(row => {

    const month = row["Month"];
    const sku = row["Uniware SKU"];
    const styleId = row["Style ID"];
    const units = toNumber(row["Units"]);

    monthSet.add(month);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        uniwareSku: sku,
        styleId,
        monthSales: {},
        stockByFC: {},
        totalStock: 0,
        inProduction: 0,
        category: styleInfo[styleId]?.category || "Unknown",
        remark: styleInfo[styleId]?.remark || "Unknown"
      };
    }

    if (!skuMap[sku].monthSales[month]) {
      skuMap[sku].monthSales[month] = 0;
    }

    skuMap[sku].monthSales[month] += units;
  });

  // ---------------- Stock (Multi FC) ----------------
  stock.forEach(row => {
    const sku = row["Uniware SKU"];
    const fc = row["FC"];
    const units = toNumber(row["Units"]);

    if (!skuMap[sku]) return;

    if (!skuMap[sku].stockByFC[fc]) {
      skuMap[sku].stockByFC[fc] = 0;
    }

    skuMap[sku].stockByFC[fc] += units;
    skuMap[sku].totalStock += units;
  });

  // ---------------- Production ----------------
  production.forEach(row => {
    const sku = row["Uniware SKU"];
    const units = toNumber(row["In Production"]);

    if (!skuMap[sku]) return;

    skuMap[sku].inProduction += units;
  });

  // ---------------- SKU Calculations ----------------
  Object.values(skuMap).forEach(item => {

    let effectiveSales = 0;
    let totalDays = 0;

    if (selectedMonth) {
      effectiveSales = item.monthSales[selectedMonth] || 0;
      totalDays = saleDaysMap[selectedMonth] || 0;
    } else {
      effectiveSales = Object.values(item.monthSales).reduce((a,b)=>a+b,0);
      totalDays = Object.values(saleDaysMap).reduce((a,b)=>a+b,0);
    }

    const drr = totalDays > 0 ? effectiveSales / totalDays : 0;
    const sc = drr > 0 ? Math.round(item.totalStock / drr) : 0;
    const required = drr * 45;
    const direct = Math.max(required - item.totalStock, 0);
    const pend = Math.max(direct - item.inProduction, 0);

    item.effectiveSales = effectiveSales;
    item.drr = drr;
    item.sc = sc;
    item.scBand = getSCBand(sc);
    item.required = required;
    item.direct = direct;
    item.pend = pend;
  });

  // ---------------- Style Aggregation ----------------
  Object.values(skuMap).forEach(skuItem => {

    const styleId = skuItem.styleId;

    if (!styleMap[styleId]) {
      styleMap[styleId] = {
        styleId,
        category: skuItem.category,
        remark: skuItem.remark,
        children: [],
        effectiveSales: 0,
        totalStock: 0,
        inProduction: 0
      };
    }

    styleMap[styleId].children.push(skuItem);
    styleMap[styleId].effectiveSales += skuItem.effectiveSales;
    styleMap[styleId].totalStock += skuItem.totalStock;
    styleMap[styleId].inProduction += skuItem.inProduction;
  });

  Object.values(styleMap).forEach(style => {

    let totalDays = selectedMonth
      ? saleDaysMap[selectedMonth] || 0
      : Object.values(saleDaysMap).reduce((a,b)=>a+b,0);

    const drr = totalDays > 0 ? style.effectiveSales / totalDays : 0;
    const sc = drr > 0 ? Math.round(style.totalStock / drr) : 0;

    style.drr = drr;
    style.sc = sc;
    style.scBand = getSCBand(sc);
  });

  computedStore.masterDataSKU = Object.values(skuMap);
  computedStore.masterDataStyle = Object.values(styleMap);
  computedStore.months = Array.from(monthSet);
}
