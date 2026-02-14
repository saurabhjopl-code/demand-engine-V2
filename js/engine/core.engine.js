import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

/**
 * MASTER CORE ENGINE
 * Consolidate → Aggregate → Calculate → Build Master
 */

export function buildCoreEngine() {

  /* -------------------------------------------------- */
  /* 1️⃣ CONSOLIDATION MAPS                             */
  /* -------------------------------------------------- */

  const monthDays = {};
  dataStore.saleDays.forEach(row => {
    const month = row["Month"];
    const days = Number(row["Days"] || 0);
    if (month) monthDays[month] = days;
  });

  const styleMeta = {};
  dataStore.styleStatus.forEach(row => {
    const styleId = row["Style ID"];
    if (!styleId) return;

    styleMeta[styleId] = {
      category: row["Category"] || "-",
      remark: row["Company Remark"] || "-"
    };
  });

  const productionMap = {};
  dataStore.production.forEach(row => {
    const sku = row["Uniware SKU"];
    if (!sku) return;
    productionMap[sku] = Number(row["In Production"] || 0);
  });

  /* -------------------------------------------------- */
  /* SALES CONSOLIDATION (DEEP)                         */
  /* -------------------------------------------------- */

  const salesMap = {};

  dataStore.sales.forEach(row => {

    const styleId = row["Style ID"];
    const sku = row["Uniware SKU"];
    const size = row["Size"];
    const month = row["Month"];
    const units = Number(row["Units"] || 0);

    if (!styleId || !sku) return;

    if (!salesMap[styleId]) {
      salesMap[styleId] = {
        skus: {},
        months: new Set(),
        totalUnits: 0
      };
    }

    if (!salesMap[styleId].skus[sku]) {
      salesMap[styleId].skus[sku] = {
        sizes: {},
        months: new Set(),
        totalUnits: 0
      };
    }

    const skuObj = salesMap[styleId].skus[sku];

    if (!skuObj.sizes[size]) {
      skuObj.sizes[size] = {
        months: {},
        totalUnits: 0
      };
    }

    // Size level
    skuObj.sizes[size].months[month] =
      (skuObj.sizes[size].months[month] || 0) + units;

    skuObj.sizes[size].totalUnits += units;

    // SKU level
    skuObj.totalUnits += units;
    skuObj.months.add(month);

    // Style level
    salesMap[styleId].totalUnits += units;
    salesMap[styleId].months.add(month);
  });

  /* -------------------------------------------------- */
  /* STOCK CONSOLIDATION                                */
  /* -------------------------------------------------- */

  const stockMap = {};

  dataStore.stock.forEach(row => {

    const styleId = row["Style ID"];
    const sku = row["Uniware SKU"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!styleId || !sku) return;

    if (!stockMap[styleId]) {
      stockMap[styleId] = {
        skus: {},
        totalStock: 0
      };
    }

    if (!stockMap[styleId].skus[sku]) {
      stockMap[styleId].skus[sku] = {
        sizes: {},
        totalStock: 0
      };
    }

    stockMap[styleId].skus[sku].sizes[size] =
      (stockMap[styleId].skus[sku].sizes[size] || 0) + units;

    stockMap[styleId].skus[sku].totalStock += units;
    stockMap[styleId].totalStock += units;
  });

  /* -------------------------------------------------- */
  /* 2️⃣ BUILD MASTER STRUCTURE                          */
  /* -------------------------------------------------- */

  const master = { styles: {} };

  Object.keys(salesMap).forEach(styleId => {

    const styleSales = salesMap[styleId];
    const styleStock = stockMap[styleId] || { skus: {}, totalStock: 0 };

    const styleObj = {
      styleId,
      category: styleMeta[styleId]?.category || "-",
      remark: styleMeta[styleId]?.remark || "-",

      totalSales: 0,
      totalStock: 0,
      totalProduction: 0,
      totalDays: 0,

      drr: 0,
      sc: 0,
      scBand: "",

      required45: 0,
      required60: 0,
      required90: 0,

      direct: 0,
      pendancy: 0,

      skus: {}
    };

    /* ---------------------------------------------- */
    /* SKU LEVEL BUILD                                */
    /* ---------------------------------------------- */

    Object.keys(styleSales.skus).forEach(sku => {

      const skuSales = styleSales.skus[sku];
      const skuStock = styleStock.skus?.[sku] || { sizes: {}, totalStock: 0 };
      const production = productionMap[sku] || 0;

      // Unique month days
      let totalDays = 0;
      skuSales.months.forEach(month => {
        totalDays += monthDays[month] || 0;
      });

      const totalSales = skuSales.totalUnits;
      const totalStock = skuStock.totalStock;

      const drr = totalDays > 0 ? totalSales / totalDays : 0;
      const sc = drr > 0 ? totalStock / drr : 0;

      const required45 = drr * 45;
      const required60 = drr * 60;
      const required90 = drr * 90;

      const direct = Math.max(0, required45 - totalStock);
      const pendancy = Math.max(0, direct - production);

      const skuObj = {
        sku,
        totalSales,
        totalStock,
        production,
        totalDays,

        drr,
        sc,
        scBand: classifySC(sc),

        required45,
        required60,
        required90,

        direct,
        pendancy,

        sizes: skuSales.sizes
      };

      styleObj.skus[sku] = skuObj;

      // Aggregate to style
      styleObj.totalSales += totalSales;
      styleObj.totalStock += totalStock;
      styleObj.totalProduction += production;
    });

    /* ---------------------------------------------- */
    /* STYLE LEVEL CALCULATION                        */
    /* ---------------------------------------------- */

    styleSales.months.forEach(month => {
      styleObj.totalDays += monthDays[month] || 0;
    });

    styleObj.drr =
      styleObj.totalDays > 0
        ? styleObj.totalSales / styleObj.totalDays
        : 0;

    styleObj.sc =
      styleObj.drr > 0
        ? styleObj.totalStock / styleObj.drr
        : 0;

    styleObj.required45 = styleObj.drr * 45;
    styleObj.required60 = styleObj.drr * 60;
    styleObj.required90 = styleObj.drr * 90;

    styleObj.direct = Math.max(0, styleObj.required45 - styleObj.totalStock);
    styleObj.pendancy = Math.max(0, styleObj.direct - styleObj.totalProduction);

    styleObj.scBand = classifySC(styleObj.sc);

    master.styles[styleId] = styleObj;
  });

  /* -------------------------------------------------- */
  /* 3️⃣ SORT STYLES BY SALES DESC                     */
  /* -------------------------------------------------- */

  master.styles = Object.fromEntries(
    Object.entries(master.styles)
      .sort((a, b) => b[1].totalSales - a[1].totalSales)
  );

  /* -------------------------------------------------- */
  /* 4️⃣ FREEZE INTO STORE                              */
  /* -------------------------------------------------- */

  computedStore.master = master;
}


/* -------------------------------------------------- */
/* SC BAND CLASSIFIER                                */
/* -------------------------------------------------- */

function classifySC(sc) {

  if (sc < 30) return "Critical";
  if (sc >= 30 && sc <= 45) return "Risk";
  if (sc > 45 && sc <= 60) return "Healthy";
  if (sc > 60 && sc <= 90) return "Safe";
  if (sc > 90 && sc <= 120) return "Watch";
  return "Overstock";
}
