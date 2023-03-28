import React from 'react';
import HeaderPublic from '../../components/HeaderPublic';
import { makeStyles } from '@mui/styles';

const Contacts = () => {

  const classes = useStyles();

  return (
    <>
      <HeaderPublic/>
      <div className={classes.wrapperBody}>
          Contacts
      </div>
    </>
  )
}

export default Contacts;

const useStyles = makeStyles((theme) => ({
  wrapperBody:{
    marginTop: '100px'
  }
}));
