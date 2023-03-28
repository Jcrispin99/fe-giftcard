import React from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { MainListItems } from "../navigation/listItems";
import { CssBaseline } from "./shared/MaterialUI";
import logo from "../assets/images/logo-kdosh.png";
import Button from '@mui/material/Button';

const HeaderPublic = (props) => {

  const [open, ] = React.useState(false);
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Divider flexItem/>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <img src={logo} alt="DashboardPublic" className={classes.logo}/>
          </IconButton>

          <Typography variant="h6" className={classes.title}></Typography>
          
          <div className={classes.wrapperItems}>
            <MainListItems type="public" />
          </div>

          <div className={classes.wrapperLogout}>
            {
              (!props?.type)
                &&
                  <Button variant="contained" className={classes.btnGetStarted} onClick={()=>history.push('/login')}>
                      Get started
                  </Button>
            }
          </div>
          
        </Toolbar>
      </AppBar>
    </>
  )
}

export default HeaderPublic;

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "white",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logo:{
    width: '288px',
    margin: '13px 0px',
    marginLeft: '89px'
  },
  wrapperLogout:{
    marginRight: '97px'
  },
  wrapperItems:{
    marginRight: '71px'
  },
  btnGetStarted:{
    padding: '4px 28px !important',
    backgroundColor: '#80BB57 !important',
    fontWeight: '700 !important',
  }
}));
