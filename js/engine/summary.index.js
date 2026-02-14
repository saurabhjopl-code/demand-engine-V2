import { buildSaleDetails } from "./summaries/saleDetails.engine.js";
import { buildFcStock } from "./summaries/fcStock.engine.js";
import { buildScBand } from "./summaries/scBand.engine.js";
import { buildCompanyRemark } from "./summaries/companyRemark.engine.js";
import { buildSizeWise } from "./summaries/sizeWise.engine.js";
import { buildCategory } from "./summaries/category.engine.js";

export function buildAllSummaries() {
  buildSaleDetails();
  buildFcStock();
  buildScBand();
  buildCompanyRemark();
  buildSizeWise();
  buildCategory();
}
