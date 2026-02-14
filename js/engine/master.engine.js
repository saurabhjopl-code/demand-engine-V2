import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

function toNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function buildMasterData(selectedMonth = null) {

  const sales = dataStore.sales || [];
  const stock = dataStore.stock || [];
  const saleDays = dataStore.saleDays || [];
  const production = dataStore.production || [];

  const skuMap = {};
  const styleMap = {};
  const monthSet = new Set();

  // ---------------------------------------
  // 1️⃣ Sale Days Map
  // ---------------------------------------
  const saleDaysMap = {};
  saleDays.forEach(row => {
    const month = row["Month"];
    saleDaysMap[month] = toNumber(row["Days"]);
  });

  computedStore.saleDaysMap = saleDaysMap;

  // ---------------------------------------
  // 2️⃣ Process Sales → SKU Map
  // ---------------------------------------
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
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    if (!skuMap[sku].monthSales[month]) {
      skuMap[sku].monthSales[month] = 0;
    }

    skuMap[sku].monthSales[month] += units;
    skuMap[sku].totalSales += units;
  });

  // ---------------------------------------
  // 3️⃣ Process Stock
  // ---------------------------------------
  stock.forEach(row => {
    const sku = row["Uniware SKU"];
    const units = toNumber(row["Units"]);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        uniwareSku: sku,
        styleId: null,
        monthSales: {},
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].stock += units;
  });

  // ---------------------------------------
  // 4️⃣ Process Production
  // ---------------------------------------
  production.forEach(row => {
    const sku = row["Uniware SKU"];
    const units = toNumber(row["In Production"]);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        uniwareSku: sku,
        styleId: null,
        monthSales: {},
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].inProduction += units;
  });

  // ---------------------------------------
  // 5️⃣ Calculate SKU-Level Metrics
  // ---------------------------------------
  Object.values(skuMap).forEach(item => {

    let totalUnits = 0;
    let totalDays = 0;

    if (selectedMonth) {
      totalUnits = item.monthSales[selectedMonth] || 0;
      totalDays = saleDaysMap[selectedMonth] || 0;
    } else {
      totalUnits = item.totalSales;
      totalDays = Object.values(saleDaysMap).reduce((a, b) => a + b, 0);
    }

    const drr = totalDays > 0 ? totalUnits / totalDays : 0;
    const sc = drr > 0 ? Math.round(item.stock / drr) : 0;

    const required45 = drr * 45;
    const required60 = drr * 60;
    const required90 = drr * 90;

    const direct = Math.max(required45 - item.stock, 0);
    const pend = Math.max(direct - item.inProduction, 0);

    item.drr = drr;
    item.sc = sc;
    item.required45 = required45;
    item.required60 = required60;
    item.required90 = required90;
    item.direct = direct;
    item.pend = pend;
  });

  // ---------------------------------------
  // 6️⃣ Build Style Map (Aggregate from SKU)
  // ---------------------------------------
  Object.values(skuMap).forEach(skuItem => {

    const styleId = skuItem.styleId || "UNKNOWN";

    if (!styleMap[styleId]) {
      styleMap[styleId] = {
        styleId,
        children: [],
        totalSales: 0,
        stock: 0,
        inProduction: 0,
        drr: 0,
        sc: 0,
        required45: 0,
        required60: 0,
        required90: 0,
        direct: 0,
        pend: 0
      };
    }

    styleMap[styleId].children.push(skuItem);

    styleMap[styleId].totalSales += skuItem.totalSales;
    styleMap[styleId].stock += skuItem.stock;
    styleMap[styleId].inProduction += skuItem.inProduction;
    styleMap[styleId].direct += skuItem.direct;
    styleMap[styleId].pend += skuItem.pend;
  });

  // ---------------------------------------
  // 7️⃣ Style-Level DRR & SC
  // ---------------------------------------
  Object.values(styleMap).forEach(styleItem => {

    let totalUnits = 0;
    let totalDays = 0;

    if (selectedMonth) {
      styleItem.children.forEach(child => {
        totalUnits += child.monthSales[selectedMonth] || 0;
      });
      totalDays = saleDaysMap[selectedMonth] || 0;
    } else {
      totalUnits = styleItem.totalSales;
      totalDays = Object.values(saleDaysMap).reduce((a, b) => a + b, 0);
    }

    const drr = totalDays > 0 ? totalUnits / totalDays : 0;
    const sc = drr > 0 ? Math.round(styleItem.stock / drr) : 0;

    styleItem.drr = drr;
    styleItem.sc = sc;
  });

  // ---------------------------------------
  // 8️⃣ Save to Store
  // ---------------------------------------
  computedStore.skuMap = skuMap;
  computedStore.styleMap = styleMap;
  computedStore.masterDataSKU = Object.values(skuMap);
  computedStore.masterDataStyle = Object.values(styleMap);
  computedStore.months = Array.from(monthSet);

  console.log("SKU Count:", computedStore.masterDataSKU.length);
  console.log("Style Count:", computedStore.masterDataStyle.length);
}
