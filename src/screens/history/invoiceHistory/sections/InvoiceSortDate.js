import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import ModelAction from "../../../../services/ModelAction";
import {confirmAlert} from "react-confirm-alert";

import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import Payment from '../../orderHistory/sections/views/Payment';
import DateToggle from "../../../../components/DateToggle/DateToggle";

class InvoiceSortDate extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeStep: 0,
            pageName: false,
        }
    }

    getStepContent = step => {
        switch (step) {
            case 0:
                return <DayView setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} deleteProduct={this.deleteProduct.bind(this)} updateSaleEntry={this.updateSaleEntry.bind(this)} />;
            case 2:
                return <WeekView getChildrenView={this.getChildrenViewDetails.bind(this)} setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            case 3:
                return <MonthView getChildrenView={this.getChildrenViewDetails.bind(this)} setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            case 4:
                return <YearView getChildrenView={this.getChildrenViewDetails.bind(this)} setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            case 5:
                return <Payment setView={this.setStepContentView.bind(this)}  />;
            default:
                return 'Complete';
        }
    };

    setStepContentView = step => {
        this.setState({
            activeStep: step
        });
    };

    getChildrenViewDetails = async (index , view) => {
        localStorage.setItem("activeHistoryIndex" , index);

        switch(view){
            case 0:
                this.setState({
                    activeStep: view
                });
                return true;
            case 2:
                this.setState({
                    activeStep: view
                });
                return true;
            case 3:
                this.setState({
                    activeStep: view
                });
                return true;
            default:
                return false;
        }
    };

    deleteProduct = async (pId) => {
        confirmAlert({
           title: 'Confirm to delete',
           message: 'Are you sure you want to delete this entry.',
           buttons: [
               {
                   label: 'Yes',
                   onClick: () => {
                       new ModelAction('SaleEntry').destroy(pId);
                   }
               },
               {
                   label: 'No',
                   onClick: () => {
                       return false;
                   }
               }
           ]
       })
   };

    async updateSaleEntry(pId, formFields){
        if (formFields.sellingPrice) {
            const data = {
                sellingPrice: parseFloat(formFields.sellingPrice)
            };
            try {
                const status = new ModelAction('SaleEntry').update(pId, data);
                console.log(status)
                if(status){
                    return true;
                }
                alert('Something went wrong');
                return false;
            }catch (e) {
                return false;
            }
        }
        else {

            try {
                const status = new ModelAction('SaleEntry').update(pId, formFields);

                if(status){
                    return true;
                }
                alert('Something went wrong');
                return false;
            }catch (e) {
                return false;
            }
        }
    };

    render() {
        return(
            <div>
                <DateToggle
                    setView={this.setStepContentView.bind(this)}
                />
                {this.getStepContent(this.state.activeStep)}
            </div>
        )
    }

}

export default withRouter(InvoiceSortDate);
