import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Navigation from "../navigation/Navigation";
import Button from '@mui/material/Button';

import { CssBaseline } from "./shared/MaterialUI";
const Footer = () => {
    const [, setHasError] = useState({});
    const [requestFailed, setRequestFailed] = useState(false);
    const classes = useStyles();
    
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
              <div className={classes.opciones}>
                {Navigation.map((nav, i) => {
                    return (
                        <ChildrenItems key={i} menu={nav} />
                    );
                })}
              </div>
            </Toolbar>
          </AppBar>
        </>
    )
}

const ChildrenItems = props => {
    const classes = useStyles();
    const history = useHistory();
    const { menu } = props;
    return (
        <div className={classes.opcion}>
            <Button key={menu.id} onClick={() => { history.push(menu.url) }} className={classes.button}>{menu.title}</Button>
        </div>
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
