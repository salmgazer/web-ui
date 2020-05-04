import { appSchema, tableSchema } from "@nozbe/watermelondb";
import brandSchema from "./brands/brandSchema";
import manufacturerSchema from "./manufacturers/manufacturerSchema";
import productCategorySchema from "./productCategories/productCategorySchema";
import productSchema from "./products/productSchema";
import branchProductSchema from "./branchesProducts/branchProductSchema";
import branchProductStockSchema from "./branchesProductsStocks/branchProductStockSchema";
import branchProductStockHistorySchema from "./branchesProductsStocksHistories/branchProductStockHistorySchema";
import customerSchema from "./customers/customerSchema";
import salesSchema from "./sales/salesSchema";
import cartsSchema from "./carts/cartsSchema";
import cartEntrySchema from "./cartEntry/cartEntrySchema";
import saleEntrySchema from "./saleEntry/saleEntriesSchema";
import branchCustomerSchema from "./branchesCustomer/branchCustomerSchema";
import saleInstallmentSchema from "./saleInstallments/saleInstallmentSchema";
import purchaseSchema from "./branchPurchases/purchaseSchema";
import stockMovementSchema from "./stockMovements/stockMovementSchema";
import auditSchema from "./audit/auditSchema";
import auditEntriesSchema from "./auditEntry/auditEntriesSchema";

export default appSchema({
  version: 11, // must always match the latest migration number in migrations.js
  tables: [
    tableSchema(brandSchema),
    tableSchema(manufacturerSchema),
    tableSchema(productCategorySchema),
    tableSchema(productSchema),
    tableSchema(branchProductSchema),
    tableSchema(branchProductStockSchema),
    tableSchema(branchProductStockHistorySchema),
    tableSchema(customerSchema),
    tableSchema(salesSchema),
    tableSchema(cartsSchema),
    tableSchema(cartEntrySchema),
    tableSchema(saleEntrySchema),
    tableSchema(branchCustomerSchema),
    tableSchema(saleInstallmentSchema),
    tableSchema(purchaseSchema),
    tableSchema(stockMovementSchema),
    tableSchema(auditSchema),
    tableSchema(auditEntriesSchema),
  ]
});
