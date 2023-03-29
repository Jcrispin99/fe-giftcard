import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../Header";
import Footer from "../Footer";
import { makeStyles } from "@mui/styles";
import { Container } from "../shared/MaterialUI";

const ProtectedRoute = (props) => {
  const Component = props.component;
  const authToken = props.user.accessToken;  
  const classes = useStyles();  
  return authToken ? (
    <div className={classes.root}>
      <Header title={props.name} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Component />
        </Container>
      </main>
      {/* <div className={classes.footer}>
        <Footer title={props.name} />
      </div> */}
    </div>
  ) : (
    <Redirect to={{ pathname: "/login" }} />
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
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '70px'
  }
}));

export default connect(mapStateToProps)(ProtectedRoute);
