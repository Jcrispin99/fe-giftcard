import React, { forwardRef, useImperativeHandle } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const SnackBarUI = forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    open: (message) => {
      setOpen(true);
      setMessage(message);
    },
  }));

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton size='small' aria-label='close' color='inherit' onClick={onClose}>
            <CancelIcon fontSize='small' />
          </IconButton>
        </React.Fragment>
      }
    />
  );
});

export default SnackBarUI;
