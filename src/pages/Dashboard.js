import React from "react";
import { connect } from "react-redux";
import {
  Container,
  Typography
} from "../components/shared/MaterialUI";

const Dashboard = () => {

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h5" component="h5">
        DASHBOARD
      </Typography>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Dashboard);
