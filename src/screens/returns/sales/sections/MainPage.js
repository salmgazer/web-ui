import React, {useState} from "react";
import {withRouter } from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import SectionNavbars from "../../../../components/Sections/SectionNavbars";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import paths from "../../../../utilities/paths";
import Grid from '@material-ui/core/Grid';
import SearchInput from "../../../Components/Input/SearchInput";
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import Button from "@material-ui/core/Button/Button";
import SingleCustomer from './singlePages/SingleCustomer';
import DateModal from '../../../../components/Modal/option/DateModal';


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      marginTop: '60px',
    }
}));

const MainPage = props => {

    const { history } = props;
    const classes = useStyles();
    const [dateDialog, setDateDialog] = React.useState(false);
    const branchCustomers = props.branchCustomers;
    const [searchValue , setSearchValue] = useState({
        search: ''
    });

    const setInputValue = (name , value) => {
        const {...oldFormFields} = searchValue;

        oldFormFields[name] = value;

        setSearchValue(oldFormFields);

        props.searchCustomer(value);
    };

    const openDateDialog = (event) => {
        setDateDialog(true);
    };

    const setView = (step) => {
        props.setView(step);
    };

    return (
        <div>
            <SectionNavbars
                title="Sales returns"
                leftIcon={
                    <div onClick={() => history.push(paths.sell)}>
                        <ArrowBackIosIcon
                            style={{fontSize: '2rem'}}
                        />
                    </div>
                }
            />

            <Paper style={{marginTop: '60px', marginBottom: '10px'}} >
                <Grid container spacing={2} style={{marginTop: '10px'}} className={`pt-2`}>
                    <Grid item xs={11} style={{padding: '10px'}} className={`mx-auto mt-7`}>
                        <Typography  style={{ fontSize: '15px'}} >
                            Select the customer who is returning the item
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper>
                <Grid container spacing={2} style={{marginTop: '13px'}} className={`pt-2`}>
                    <Grid item xs={11} style={{padding: '10px 8px 15px 8px'}} className={`mx-auto mt-7`}>
                        <SearchInput
                            inputName="search"
                            styles={{
                                border: '1px solid #e5e5e5',
                                padding: '4px 0px'
                            }}
                            getValue={setInputValue.bind(this)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {branchCustomers.length === 0
                ?
                <Grid
                    item xs={12}
                    className={`text-left pl-2`}
                >
                    <div className={`rounded mx-1 my-2 p-2 bordered`}>
                        <Typography
                            component="h6"
                            variant="h6"
                            style={{fontSize: '16px'}}
                            className={`text-center text-dark w-100`}
                        >
                            No customer/invoice found
                        </Typography>
                    </div>
                </Grid>
                :
                branchCustomers.map((branchCustomer) =>
                <Grid key={branchCustomer.id} item xs={12} onClick={() => setView(0)} >
                    <SingleCustomer customer = {branchCustomer} />
                </Grid>
                )
            }

            <DateModal
                openDateDialog={dateDialog}
                handleClose={() => setDateDialog(false)}
            />

            <Box
                className="shadow1"
                bgcolor="background.paper"
                p={1}
                style={{ height: '3.0rem', position: "fixed", bottom:"1px", width:"100%" }}
            >
                <Button
                    variant="outlined"
                    style={{border: '1px solid #DAAB59', color: '#DAAB59', padding: '5px 50px', marginRight: '10px', textTransform: 'Capitalize'}}
                    onClick={() => history.push(paths.sell)}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    style={{'backgroundColor': '#DAAB59' , color: '#333333', padding: '5px 20px', textTransform: 'Capitalize'}}
                    onClick={openDateDialog.bind(this)}
                >
                    Search by date
                </Button>
            </Box>

        </div>
    )
}

export default withRouter(MainPage);