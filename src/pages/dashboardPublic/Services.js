import React from 'react';
import HeaderPublic from '../../components/HeaderPublic';
import { makeStyles } from '@mui/styles';

const Services = () => {

  const classes = useStyles();

  return (
    <>
      <HeaderPublic/>
      <div className={classes.wrapperBody}>
          Services
      </div>
    </>
  )
}

export default Services;

const useStyles = makeStyles((theme) => ({
  wrapperBody:{
    marginTop: '100px'
  }
}));
