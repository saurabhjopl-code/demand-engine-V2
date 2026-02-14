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

  const masterMap = {};
  const monthSet = new Set();

  // ---------------------------------
  // 1️⃣ Build Sale Days Map
  // ---------------------------------
  const saleDaysMap = {};
  saleDays.forEach(row => {
    const month = row["Month"];
    const days = toNumber(row["Days"]);
    saleDaysMap[month] = days;
  });

  computedStore.saleDaysMap = saleDaysMap;

  // ---------------------------------
  // 2️⃣ Process Sales
  // ---------------------------------
  sales.forEach(row => {

    const month = row["Month"];
    const uniwareSku = row["Uniware SKU"];
    const styleId = row["Style ID"];
    const units = toNumber(row["Units"]);

    monthSet.add(month);

    if (!masterMap[uniwareSku]) {
      masterMap[uniwareSku] = {
        uniwareSku,
        styleId,
        monthSales: {},
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    if (!masterMap[uniwareSku].monthSales[month]) {
      masterMap[uniwareSku].monthSales[month] = 0;
    }

    masterMap[uniwareSku].monthSales[month] += units;
    masterMap[uniwareSku].totalSales += units;
  });

  // ---------------------------------
  // 3️⃣ Process Stock
  // ---------------------------------
  stock.forEach(row => {
    const uniwareSku = row["Uniware SKU"];
    const units = toNumber(row["Units"]);

    if (!masterMap[uniwareSku]) {
      masterMap[uniwareSku] = {
        uniwareSku,
        styleId: null,
        monthSales: {},
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    masterMap[uniwareSku].stock += units;
  });

  // ---------------------------------
  // 4️⃣ Process Production
  // ---------------------------------
  production.forEach(row => {
    const uniwareSku = row["Uniware SKU"];
    const units = toNumber(row["In Production"]);

    if (!masterMap[uniwareSku]) {
      masterMap[uniwareSku] = {
        uniwareSku,
        styleId: null,
        monthSales: {},
        totalSales: 0,
        stock: 0,
        inProduction: 0
      };
    }

    masterMap[uniwareSku].inProduction += units;
  });

  // ---------------------------------
  // 5️⃣ Compute DRR + SC + Demand
  // ---------------------------------
  const result = [];

  Object.values(masterMap).forEach(item => {

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

    result.push({
      ...item,
      drr,
      sc,
      required45,
      required60,
      required90,
      direct,
      pend
    });
  });

  computedStore.masterData = result;
  computedStore.months = Array.from(monthSet);

  console.log("Master Data Built:", computedStore.masterData.length);
}
