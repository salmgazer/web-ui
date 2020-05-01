import LocalInfo from "./LocalInfo";
import ModelAction from "./ModelAction";
import BranchProductService from "./BranchProductService";
import isToday from 'date-fns/isToday'
import isWeek from "date-fns/isThisWeek";
import isThisMonth from "date-fns/isThisMonth";
import isYear from "date-fns/isThisYear";
import isSameDay from "date-fns/isSameDay";
import isSameWeek from "date-fns/isSameWeek";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";
import SaleService from "./SaleService";
import database from "../models/database";
import * as Q from "@nozbe/watermelondb/QueryDescription";

export default class BranchService {
    constructor (branchId = LocalInfo.branchId) {
        this.branch = (LocalInfo.branches).find(branch => branch.branchId === branchId);
        this.branchId = branchId;
    }

    getProducts() {
        return new ModelAction('BranchProduct').findByColumnNotObserve({
            name: 'branchId',
            value: this.branchId,
            fxn: 'eq'
        });
    }

    /*
    * Get a branches customers
    * */
    getCustomers() {
        return new ModelAction('BranchCustomer').findByColumnNotObserve({
            name: 'branchId',
            value: this.branchId,
            fxn: 'eq'
        });
    }

    /*
    * Search for a branch product
    * */
    async searchBranchProduct(searchValue) {
        const products = await new ModelAction('Product').findByColumnNotObserve({
            name: 'name',
            value: searchValue,
            fxn: 'like'
        });

        return  database.collections.get('branches_products').query(Q.where('productId',
          Q.oneOf(products.map(p => p.id))), Q.where('branchId', LocalInfo.branchId)).fetch();
    }

    /*
    * @var product with barcode
    * @return object
    * @todo barcode search...
    * */
    async searchBarcodeProduct(barcode){
        console.log(barcode)
        const branchProducts = await this.getProducts() || [];
        console.log(branchProducts);
        //(await new BranchProductService(product).product()).barCode
        //const products = branchProducts.filter((product) => (product.id === barcode));
        const products = branchProducts.map(async (product) => {
            return await BranchService.filterProduct('barCode' , barcode , product)
        });

        console.log(products)
        //return products;
    }

    /*
    * Filter item
    * */
    static async filterProduct(column , value , item){
        const product = await new BranchProductService(item).product();
        console.log(product)
        return product[column] === value;
    }

    /*
    * Get Today sales using user role
    * @return all today sales
    * */
    async getTodaySales() {
        const userRole = LocalInfo.userRole;
        let todaySales = [];

        if(userRole === 'owner'){
            const sales = await new ModelAction('Sales').findByColumnNotObserve(
                {
                    name: 'branchId',
                    value: LocalInfo.branchId,
                    fxn: 'eq',
                }
            );

            todaySales = sales.filter(sale => isToday(sale.createdAt))
        }

        /*
        * @todo handle other user roles
        * */

        return todaySales;
    }

    static async getSales(duration, date) {
        const branches = (LocalInfo.branches).map(branch => branch.branchId);

        const sales = await new ModelAction('Sales').findByColumnNotObserve(
            {
                name: 'branchId',
                value: branches,
                fxn: 'oneOf'
            }
        );

        const day = new Date(date);

        // switch (duration) {
        //     case 'today':
        //         return sales.filter(sale => isToday(sale.createdAt));
        //     case 'week':
        //         return sales.filter(sale => isWeek(sale.createdAt));
        //     case 'month':
        //         return sales.filter(sale => isThisMonth(sale.createdAt));
        //     case 'year':
        //         return sales.filter(sale => isYear(sale.createdAt));
        // }
        switch (duration) {
            case 'day':
                return sales.filter(sale => isSameDay(new Date(sale.createdAt) , day));
            case 'week':
                //console.log(isSameWeek(sale.salesDate, day))
                return sales.filter(sale => isSameWeek(new Date(sale.createdAt), day));
            case 'month':
                return sales.filter(sale => isSameMonth(new Date(sale.createdAt), day));
            case 'year':
                return sales.filter(sale => isSameYear(new Date(sale.createdAt), day));
        }

    }

    /*
    * Get today sales total details
    * @return number - promise
    * */
    async getSalesDetails(duration , date) {
        const sales = await BranchService.getSales(duration , date);

        let total = 0;
        let costPrice = 0;
        let profit = 0;
        let credit = 0;
        let sellingPrice = 0;
        let quantity = 0;
        let purchases = 0;

        for (let step = 0; step < sales.length; step++) {
            costPrice += parseFloat(await SaleService.getSaleEntryCostPriceById(sales[step].id));
        }

        for (let step = 0; step < sales.length; step++) {
            sellingPrice += parseFloat(await SaleService.getSaleEntrySellingPriceById(sales[step].id));
        }

        for (let step = 0; step < sales.length; step++) {
            quantity += parseFloat(await SaleService.getSaleProductQuantity(sales[step].id));
        }

        for (let step = 0; step < sales.length; step++) {
            total += parseFloat(await SaleService.getSaleEntryAmountById(sales[step].id));
        }

        for (let step = 0; step < sales.length; step++) {
            profit += parseFloat(await SaleService.getSaleEntryProfitById(sales[step].id));
        }

        for (let step = 0; step < sales.length; step++) {
            credit += parseFloat(await SaleService.getSaleEntryCreditById(sales[step].id));
        }

        return {
            sales:sales, 
            total,
            profit,
            credit,
            purchases,
            sellingPrice,
            quantity,
            costPrice
        };
    }
}
