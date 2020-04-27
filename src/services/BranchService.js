import LocalInfo from "./LocalInfo";
import ModelAction from "./ModelAction";
import BranchProductService from "./BranchProductService";
import isToday from 'date-fns/isToday'
import isWeek from "date-fns/isThisWeek";
import isThisMonth from "date-fns/isThisMonth";
import isYear from "date-fns/isThisYear";
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
        const branchProducts = await this.getProducts();
        const products = await new ModelAction('Product').findByColumnNotObserve({
            name: 'name',
            value: searchValue,
            fxn: 'like'
        });

        //const products = database.collections.get('products').query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(searchValue)}%`))).fetch();


        console.log(products)
        return  database.collections.get('branches_products').query(Q.where('productId', Q.oneOf(products.map(p => p.id)))).fetch();

        // branch products
        // search value, name of product
        // search products
        // search branch products where productId is in list of ids of products returned, and branchId is activeBranch

        /*

        const searchResults = branchProducts.map(async function(item) {
            return await item.product.fetch().name === searchValue;
            //return database.collections.get('products').query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(search)}%`))).fetch()
            //return (((await item.product.fetch()).name).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
        });

        console.log(searchResults)
        return searchResults;
        */

        //console.log(await searchResults);
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
        if(product[column] === value){
            return true;
        }
        return false;
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

    static async getSales(duration) {
        const branches = (LocalInfo.branches).map(branch => branch.branchId);

        const sales = await new ModelAction('Sales').findByColumnNotObserve(
            {
                name: 'branchId',
                value: branches,
                fxn: 'oneOf'
            }
        );

        switch (duration) {
            case 'today':
                return sales.filter(sale => isToday(sale.createdAt));
            case 'week':
                return sales.filter(sale => isWeek(sale.createdAt));
            case 'month':
                return sales.filter(sale => isThisMonth(sale.createdAt));
            case 'year':
                return sales.filter(sale => isYear(sale.createdAt));
        }

    }

    /*
    * Get today sales total details
    * @return number - promise
    * */
    async getSalesDetails(duration , branchId = LocalInfo.branchId) {
        const sales = await BranchService.getSales(duration , branchId);

        let total = 0;
        let profit = 0;
        let credit = 0;
        let purchases = 0;

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
            total,profit,credit,purchases
        };
    }
}
