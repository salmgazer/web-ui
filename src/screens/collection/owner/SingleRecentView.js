import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { withRouter } from "react-router-dom";

const SingleCollectionView = props => {

    const collection = props.collection;

    return (
        <div>
                
            <Paper variant="outlined" style={{marginBottom: '30px', textAlign: 'center', width: '90%',marginLeft: '15px',}}>
                <Grid container spacing={1} >
                    <Grid item xs={9} style={{display: 'table', height: '60px', margin: '8px 0px'}} >
                        <div style={{textAlign: 'left', display: 'table-cell', verticalAlign: 'middle'}}>
                            <div className='text-dark font-weight-bold'  style={{ paddingBottom: '5px', marginLeft: '10px'}}>{collection.date}</div>
                            <div className="font-weight-light mt-1" style={{ fontSize: '13px', paddingBottom: '5px', marginLeft: '10px'}}>{collection.name}</div>
                            <div className="font-weight-light mt-1" style={{ fontSize: '13px', marginLeft: '10px'}}>Collected: GHC {collection.amount}</div>
                        </div>
                    </Grid>

                    <Grid item xs={2} style={{ paddingTop: "20px", fontSize: '10px' }} >
                        <CheckCircleIcon style={{fontSize: '20px', color: '#76eb0aef'}} />
                            <br/>
                        Approved
                    </Grid>
                       
                </Grid>
            </Paper>
                
        </div>
    )
}

export default withRouter(SingleCollectionView);