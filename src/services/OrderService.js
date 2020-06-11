import LocalInfo from "./LocalInfo";
import ModelAction from "./ModelAction";
import isSameDay from "date-fns/isSameDay";
import isSameWeek from "date-fns/isSameWeek";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";
import BranchStockService from './BranchStockService';
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";

export default class OrderService {
    constructor(){
        this.branchId = LocalInfo.branchId;
    }

    static async getOrderHistory(duration , date){
        const purchases = await new ModelAction('BranchProductStock').findByColumnNotObserve(
            {
                name: 'branchId',
                value: LocalInfo.branchId,
                fxn: 'eq'
            }
        );

        const orders = purchases.filter(purchase => purchase.branchSupplierOrderId !== null || purchase.branchSupplierOrderId !== '');

        const day = new Date(date);

        console.log(day)
        switch (duration) {
            case 'day':
                return orders.filter(order => isSameDay(format(fromUnixTime(new Date(order.createdAt)), 'MM/dd/yyyy') , day));
            case 'week':
                //console.log(isSameWeek(sale.salesDate, day))
                return orders.filter(order => isSameWeek(format(fromUnixTime(new Date(order.createdAt)), 'MM/dd/yyyy') , day));
            case 'month':
                return orders.filter(order => isSameMonth(format(fromUnixTime(new Date(order.createdAt)), 'MM/dd/yyyy') , day));
            case 'year':
                return orders.filter(order => isSameYear(format(fromUnixTime(new Date(order.createdAt)), 'MM/dd/yyyy') , day));
        }
    }

    async getOrderDetails(duration , date) {
        const order = (await OrderService.getOrderHistory(duration , date)).reverse();
        console.log(order);
        let costPrice = 0;
        let profit = 0;
        let sellingPrice = 0;
        let quantity = 0;

        for (let step = 0; step < order.length; step++) {
            costPrice += parseFloat(await BranchStockService.getStockEntryCostPriceById(order[step].id));
        }

        for (let step = 0; step < order.length; step++) {
            profit += parseFloat(await BranchStockService.getStockEntryProfitById(order[step].id));
        }

        for (let step = 0; step < order.length; step++) {
            quantity += parseFloat(await BranchStockService.getStockProductQuantity(order[step].id));
            
            const branchProduct = await new ModelAction('BranchProduct').findByColumnNotObserve({
                name: 'productId',
                value: order[step].productId,
                fxn: 'eq'
            });
            const sell = quantity * branchProduct[0].sellingPrice;

            sellingPrice = parseFloat(sell);
        }

        profit = sellingPrice - costPrice;

        return {
            orders: order,
            costPrice,
            profit,
            sellingPrice,
            quantity
        }
    }
}
