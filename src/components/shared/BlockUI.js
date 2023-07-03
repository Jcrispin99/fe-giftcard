import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 9999,
    color: '#fff',
    margin: 0,
  },
}));

const BlockUI = forwardRef((props, ref) => {

    const classes = useStyles();
    const messageDefault = props.hasOwnProperty('message') ? props.message : '';
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(messageDefault);

    useImperativeHandle(ref, () => ({
      open: (visible, message = '') => {
        setVisible(visible);
        if (message !== '') {
          setMessage(message);
        }
      },
    }));

    let content;
    if (message !== '') {
      content = <div><div>{message}</div><CircularProgress color="inherit" /></div>;
    } else {
      content = <CircularProgress color="inherit" />;
    }

    return (
      <Backdrop className={classes.backdrop} open={visible}>
        {content}
      </Backdrop>
    );
});

export default BlockUI;
