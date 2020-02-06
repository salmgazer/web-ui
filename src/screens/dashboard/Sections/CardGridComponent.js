import React from 'react';

import Typography from "@material-ui/core/Typography/Typography";
import CardDefault from "../../Components/Cards/CardDefault";
import Grid from "@material-ui/core/Grid/Grid";



export default function CardGridComponent(props) {
    return (
        <Grid item xs={6}>
            <CardDefault styles={{width: '85%', marginTop: '10px', borderRadius: '10px'}}>
                <Typography
                    component="h6"
                    variant="h6"
                    style={{fontWeight: '500', fontSize: '16px'}}
                >
                    {props.title}
                </Typography>
                <Typography
                    component="h5"
                    variant="h5"
                    style={{fontWeight: '700', fontSize: '22px'}}
                >
                    GHC {props.amount}
                </Typography>
            </CardDefault>
        </Grid>
    );
}
