import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Navigation from "../navigation/Navigation";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { CssBaseline } from "./shared/MaterialUI";

const Footer = (props) => {

    const [, setHasError] = useState({});
    const [requestFailed, setRequestFailed] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    
    useEffect(() => {
        if (!setRequestFailed) {
            setHasError("");
        }
    }, [requestFailed]);

    return (
        <>
          <CssBaseline />
          <AppBar position="absolute">
            <Toolbar className={classes.toolbar}>
              <div>
                <IconButton
                  component="label"
                  onClick={()=>{props.logout()}}
                  style={{backgroundColor: 'rgb(255 0 0 / 60%)'}}
                >
                  <LogoutIcon />
                </IconButton>
                <IconButton
                  component="label"
                  onClick={()=>{history.push('/ticket')}}
                  style={{backgroundColor: '#00beff2b', marginLeft: '15px'}}
                >
                  <QrCode2Icon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Footer);
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    title: {
        flexGrow: 1,
    },
    toolbar: {
        paddingRight: 24, 
        backgroundColor: "white",
    },
    opciones:{
        'overflow': 'hidden',
        'textAlign': 'center',
        'margin': 'auto'
    },
    opcion:{
        'display': 'inline-table',
        'padding': '15px',
        'margin': '3px',
    },
    button:{
        'fontSize': '11px',
        'color':'#9e1a00'
    }
}));
