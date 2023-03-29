import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppService from '../services/AppService';
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { MainListItems } from "../navigation/listItems";
import { CssBaseline } from "./shared/MaterialUI";
import logo from "../assets/images/logo-kdosh.png";
import { Menu, MenuItem } from "@mui/material";
import { AccountCircleOutlined } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import { WizardStyles } from "../assets/css/wizard-style";

const Header = (props) => {
  const [, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [open, ] = React.useState(false);
  const history = useHistory();
  const classes = useStyles();
  const wizardStyle = WizardStyles();
  const accessToken = props.user.accessToken;
  const firstName = props.user.firstName;
  const appService = new AppService();
  const menuId = 'primary-search-account-menu';

  useEffect(() => {
    if (!setRequestFailed) {
      setHasError("");
    }
  }, [requestFailed]);

  const logout = async () => {
    try {
      setRequestFailed(false);
      appService.setAccessToken(accessToken);
      props.dispatch({ type: 'LOGOUT' });
      history.push('/login');
    } catch (e) {
      setRequestFailed(true);
      setHasError({ message: e.response.data.message });
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { logout() }} style={{ 'fontSize': '15px' }}>Logout</MenuItem>
    </Menu>
  );

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
            <img src={logo} alt="Admin" className={classes.logo}/>
          </IconButton>

          <Typography variant="h6" className={classes.title}></Typography>
          
          <div className={classes.wrapperItems}>
            <MainListItems />
          </div>

          <div className={wizardStyle.wrapperLogout}>
            <span>Hi </span>
            <span className={wizardStyle.title}>{firstName}!</span>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircleOutlined />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <ExpandMore />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Header);
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
    width: '20%',
    margin: '13px 0px',
    marginLeft: '89px'
  },
  wrapperItems:{
    marginRight: '71px'
  },
}));
