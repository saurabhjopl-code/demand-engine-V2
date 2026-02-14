import { renderSaleDetails } from "./summaries/saleDetails.binding.js";
import { renderFcStock } from "./summaries/fcStock.binding.js";
import { renderScBand } from "./summaries/scBand.binding.js";
import { renderCompanyRemark } from "./summaries/companyRemark.binding.js";
import { renderSizeWise } from "./summaries/sizeWise.binding.js";
import { renderCategory } from "./summaries/category.binding.js";

export function renderAllSummaries() {
  renderSaleDetails();
  renderFcStock();
  renderScBand();
  renderCompanyRemark();
  renderSizeWise();
  renderCategory();
}
