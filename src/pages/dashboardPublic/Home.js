import React from 'react';
import HeaderPublic from '../../components/HeaderPublic';
import { makeStyles } from '@mui/styles';

const Home = () => {

  const classes = useStyles();

  return (
    <>
      <HeaderPublic/>
      <div className={classes.wrapperBody}>
          Home
      </div>
    </>
  )
}

export default Home;

const useStyles = makeStyles((theme) => ({
  wrapperBody:{
    marginTop: '100px'
  }
}));
