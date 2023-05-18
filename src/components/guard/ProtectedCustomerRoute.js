import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Footer from "../Footer";
import { makeStyles } from "@mui/styles";
import { Container } from "../shared/MaterialUI";
import store from "../../redux/store";
import { AppService } from "../../services";

const ProtectedRoute = (props) => {
  const Component = props.component;
  const authToken = props.user.accessToken;  
  const classes = useStyles();  
  const state = store.getState();
  const appService = new AppService();
  const history = useHistory();
  const isMobile = /mobile|android/i.test(navigator.userAgent);

  const logout = async () => {
    try {
      appService.setAccessToken(authToken);
      props.dispatch({ type: 'LOGOUT' });
      history.push('/gift-card-customer');
    } catch (e) {
      
    }
  };

  return authToken ? (
    <>
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Component />
          </Container>
        </main>

        {
          ((state.user.role === 'USER_ROLE' && isMobile))
            &&
              <div className={classes.footer}>
                <Footer logout={logout}/>
              </div>
        }

      </div>
    </>
  ) : (
    <Redirect to={{ pathname: "/gift-card-customer" }} />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: 'white'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  footer: {
    width: '100%',
    height: '70px',
    position: 'absolute',
    marginTop: '0px'
  }
}));

export default connect(mapStateToProps)(ProtectedRoute);
