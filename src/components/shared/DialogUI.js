import React, { forwardRef, useImperativeHandle, useState } from 'react';

import {
  cloneDeep as _cloneDeep, 
  keys as _keys, 
  merge as _merge, 
  pick as _pick,
} from 'lodash';

import {
  Dialog,
  DialogActions, 
  DialogContent, 
  DialogContentText,
  DialogTitle, 
  Grid,
} from '@mui/material';



import AppButton from '../forms/AppButton';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  importantMessage: {
    fontWeight: 'bold',
  },
  title:{
    textAlign: 'center',
    fontFamily: 'Barlow Condensed',
    fontSize: '10px'
  },
  wrapperLink: {
    textAlign: 'center',
    paddingBottom: '27px !important',
    '& .link': {
      color: '#065f1c',
      textDecoration: 'none'
    }
  }
}));

const template = {
  main: {
    title: '',
    content: '',
    important: '',
  },
  btn: {
    confirm: 'SI',
    close: 'Ok',
  },
  confirm: false,
  close: false,
  onConfirm: () => {},
};

const DialogUI = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(template);

  const onClose = () => {
    if (settings.close) {
      settings.onConfirm();
    } else {
      setOpen(false);
    }
  };

  const onConfirm = () => {
    settings.onConfirm();
  };

  useImperativeHandle(ref, () => ({
    open: (title, content, settings = null, important = '', link='', bodyLink={}) => {
      let defaultSettings = _cloneDeep(template);
      if (settings !== null) {
        const clean = _pick(settings, _keys(template));
        const copy = _cloneDeep(template);
        defaultSettings = _merge(copy, clean);
      }
      defaultSettings.main.title = title;
      defaultSettings.main.content = content;
      defaultSettings.main.important = important;
      defaultSettings.main.link = link;
      defaultSettings.main.bodyLink = bodyLink;
      setSettings(defaultSettings);
      setOpen(true);
    },
    close: () => setOpen(false),
  }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>{settings.main.title}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: 'center'}}>{settings.main.content}</DialogContentText>
          <DialogContentText className={classes.importantMessage}>{settings.main.important}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container direction='row' alignItems='center' spacing={1}>
            {
              (settings.main.link)
                ?
                  <Grid item xs={12} className={classes.wrapperLink}>
                    <a className="link" href={settings.main.bodyLink.route}>{settings.main.bodyLink.message}</a>
                  </Grid>
                :
                  <Grid item xs={settings.confirm ? 6 : 12} className="test">
                    {settings.confirm && (
                      <AppButton onPress={onConfirm} label={settings.btn.confirm} type={'main'} color={'primary'} background='blue'/>
                    )}
                  </Grid>
            }
            <Grid item xs={settings.confirm ? 6 : 12}>
              <AppButton onPress={onClose} label={settings.btn.close} type={'main'} color={'primary'} background='red'/>
            </Grid>
          </Grid>
        </DialogActions>
    </Dialog>
  );
});

export default DialogUI;
