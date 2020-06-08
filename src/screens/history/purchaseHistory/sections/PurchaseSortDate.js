import React, {Component} from 'react';
import {withRouter} from "react-router";
import {confirmAlert} from "react-confirm-alert";
import ModelAction from "../../../../services/ModelAction";
import * as Q from "@nozbe/watermelondb/QueryDescription";
import BranchStockService from "../../../../services/BranchStockService";
import BranchProductStock from "../../../../models/branchesProductsStocks/BranchProductStock";

import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import DateToggle from "../../../../components/DateToggle/DateToggle";
import getUnixTime from 'date-fns/getUnixTime';
import SimpleSnackbar from "../../../../components/Snackbar/SimpleSnackbar";

class SortDate extends Component{
    state={
        activeStep: 0,
        pageName: false,
        error: false,
        errorMsg: '',
        success: false,
        successMsg: '',
    }

    getStepContent = step => {
        switch (step) {
            case 0:
                return <DayView setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} deleteProduct={this.deleteProduct.bind(this)}  updateStockEntry={this.updateStockEntry.bind(this)} />;
            case 2:
                return <WeekView setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            case 3:
                return <MonthView setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            case 4:
                return <YearView setView={this.setStepContentView.bind(this)} pageName={this.state.pageName} />;
            default:
                return 'Complete';
        }
    };

    setStepContentView = step => {
        this.setState({
            activeStep: step
        });
    };

    async componentDidUpdate(prevProps) {
        const {...props} = this.props;

        if(prevProps.activeStep !== props.activeStep){
            console.log('me')
        }
    }

    deleteProduct = async (pId) => {
        confirmAlert({
           title: 'Confirm to delete',
           message: 'Are you sure you want to delete this entry.',
           buttons: [
               {
                   label: 'Yes',
                   onClick: () => {
                       new ModelAction('BranchProductStock').destroy(pId);
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

    async updateStockEntry(pId, formFields){
        const data = {
            costPrice: parseFloat(formFields.costPrice)
        };

        try {
            await new ModelAction('BranchProductStock').update(pId, data);

            return true;
        }catch (e) {
            return false;
        }
    };

    render(){
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

export default withRouter(SortDate);
