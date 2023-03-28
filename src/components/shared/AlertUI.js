import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

const AlertUI = forwardRef((props, ref) => {
const messageDefault = props.hasOwnProperty('message') ? props.message : 'Reload the app.';
const colorDefault = props.hasOwnProperty('color') ? props.color : 'success';
const [visible, setVisible] = useState(false);
const [message, setMessage] = useState(messageDefault);
const [, setColor] = useState(colorDefault);

useImperativeHandle(ref, () => ({
  open: (visible, message = '', color = '') => {
    setVisible(visible);
    if (message !== '') {
      setMessage(message);
    }
    if (color !== '') {
      setColor(color);
    }
  },
}));

setTimeout(() => {
  setVisible(false);
}, 5000);

return (
  <Collapse in={visible}>
    <Alert severity="error">
      {message}
    </Alert>
  </Collapse>
);
});

export default AlertUI;
