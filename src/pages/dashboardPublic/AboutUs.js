import React from 'react';
import HeaderPublic from '../../components/HeaderPublic';
import { makeStyles } from '@mui/styles';

const AboutUs = () => {

  const classes = useStyles();

  return (
    <>
      <HeaderPublic/>
      <div className={classes.wrapperBody}>
          AboutUs
      </div>
    </>
  )
}

export default AboutUs;

const useStyles = makeStyles((theme) => ({
  wrapperBody:{
    marginTop: '100px'
  }
}));
