import React , {useState} from "react";
import OtpInput from 'react-otp-input';
import Component from "@reactions/component";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SectionNavbars from '../Components/Sections/SectionNavbars';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import './verify.scss';

import confirmImg from '../../assets/img/confirm.jfif';
import Button from "@material-ui/core/Button/Button";
import paths from "../../utilities/paths";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import SimpleSnackbar from "../Components/Snackbar/SimpleSnackbar";
import PrimaryLoader from "../Components/Loader/Loader";
import AuthService from "../../services/AuthService";
import GenerateOTP from "../../services/GenerateString";


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    shadow1: {
        '-webkit-box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
        '-moz-box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
        'box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const VerifySMS = props => {
    const { history } = props;
    const [loading , setLoading] = useState(false);
    const [loadingSMS , setLoadingSMS] = useState(false);
    const classes = useStyles();
    const [successDialog, setSuccessDialog] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    //Logic for verifying SMS
    const verifySMS = async({otp}) => {
        if(otp.toString().length < 4){
            alert('Please check code');
            return;
        }

        setLoading(true);

        let code = parseFloat(localStorage.getItem('userOTP'));

        if(code === otp){
            setSuccessMsg('You have successfully created an account.');
            setSuccessDialog(true);
            setTimeout(function(){
                setSuccessDialog(false);
                history.push(paths.get_started);
            }, 2000);
        }else{
            setLoading(false);
            setErrorMsg('Number you entered is incorrect. Please enter again!');
            setErrorDialog(true);
            return false
        }
    };

    const resendSMS = async () => {
        setLoadingSMS(true);

        const phone = localStorage.getItem('userContact');
        const otp = new GenerateOTP(4).generateNumber();
        const name = localStorage.getItem('userFirstName');

        try{
            await new AuthService().sendOTP(name , phone , otp);

            setSuccessMsg('YOur verification code has been sent.');
            setSuccessDialog(true);
            localStorage.setItem('userOTP' , otp);

            setTimeout(function(){
                setSuccessDialog(false);
            }, 2000);

        }catch (error){
            setErrorMsg('Could not send code. Please enter again!');
            setErrorDialog(true);
            return false;
        }

        setLoadingSMS(false);
        //console.log(req);
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorDialog(false);
    };

    return (
        <div className={classes.root} style={{ backgroundColor: '#ffffff', height: '100vh' }}>
            <SectionNavbars>
                <CloseIcon onClick={() => history.push(paths.login)} />
            </SectionNavbars>

            <SimpleSnackbar
                type="success"
                openState={successDialog}
                message={successMsg}
            />

            <Component
                initialState={{
                    otp: '',
                }}
            >
                {({ state, setState }) => (
                    <React.Fragment>
                        <CssBaseline />

                        <Container maxWidth="sm">
                            <Snackbar open={errorDialog} autoHideDuration={6000} onClose={handleCloseSnack}>
                                <Alert onClose={handleCloseSnack} severity="error">
                                    {errorMsg}
                                </Alert>
                            </Snackbar>
                            <Box component="div" m={2} style={{paddingTop: '60px'}}>
                                <img className="img-responsive" src={confirmImg} alt={'test'}/>
                            </Box>
                            <Typography variant="h6" component="h6">
                                Verify phone number
                            </Typography>

                            <Typography
                                variant="h6"
                                component="p"
                                style={{fontSize: '14px' , color: '#403c3c94', textAlign: 'center', width: '60%', margin: '0 auto' }}
                            >
                                Please enter the four digit pin sent to your phone
                            </Typography>
                            <div
                                style={{display: 'inline-flex'}}
                            >
                                <OtpInput
                                    onChange={otp => setState({otp})}
                                    numInputs={4}
                                    separator=""
                                    value={state.otp}
                                    inputStyle="inputStyle"
                                    focusStyle="activeInputStyle"
                                    isInputNum="true"
                                    shouldAutoFocus="true"
                                />
                            </div>

                            <br/>
                            <p>{successDialog}</p>
                            <Button
                                variant="contained"
                                style={{'backgroundColor': '#DAAB59' , color: '#333333', padding: '8px 40px', fontSize: '14px', fontWeight: '700'}}
                                className={classes.button}
                                onClick={() => verifySMS(state)}
                                disabled={loading}
                            >
                                {
                                    loading ?
                                        <PrimaryLoader
                                            style={{width: '30px' , height: '2.5rem'}}
                                            color="#FFFFFF"
                                            type="Oval"
                                            className={`mt-1`}
                                            width={25}
                                            height={25}
                                        />
                                        :
                                        'Finish'
                                }
                            </Button>

                            <Grid
                                item xs={12}
                                alignItems="center"
                                style={{margin: '15% auto 5px'}}
                            >
                                <Typography
                                    component="span"

                                >
                                    Didn't receive code?
                                </Typography>

                                <Button
                                    variant="outlined"
                                    style={{border: '1px solid #DAAB59', textAlign: 'center', color: '#DAAB59', padding: '8px 15px', fontSize: '12px', marginLeft: '10px'}}
                                    className={classes.button + ' ' + classes.shadow1}
                                    onClick={() => resendSMS()}
                                    disabled={loadingSMS}
                                >
                                    {
                                        loadingSMS ?
                                            <PrimaryLoader
                                                style={{width: '30px' , height: '2.5rem'}}
                                                color="#FFFFFF"
                                                type="Oval"
                                                className={`mt-1`}
                                                width={25}
                                                height={25}
                                            />
                                            :
                                            'Resend Code'
                                    }
                                </Button>
                            </Grid>
                        </Container>
                    </React.Fragment>
                )}
            </Component>
        </div>
    );
};

export default withRouter(VerifySMS);
