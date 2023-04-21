import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Input,
  InputAdornment,
  Visibility,
  VisibilityOff, 
  Alert,
} from "../../components/shared/MaterialUI";

import { connect } from "react-redux";
import { addUser } from "../../redux/actions/user";
import store from "../../redux/store";
import { useHistory, Link } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import { useUI } from "../../app/context/ui";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import logo from "../../assets/images/login-logo.png";
import { LoginStyles } from "../../assets/css/login-style";
import _ from "lodash";

const LoginPage = (props) => {
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const [open, setOpen] = useState(true);

  let locationState = false;
  if (!_.isUndefined(props.location)) {
    locationState = _.isUndefined(props.location.state) ? false : props.location.state;
  }

  const loginStyle = LoginStyles();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { blockUI } = useUI();
  const history = useHistory();

  const state = store.getState();
  const accessToken = state.user.accessToken;
  if (accessToken) {
    history.push("/dashboard");
  }

  const authService = new AuthService();
  const userService = new UserService();

  useEffect(() => {
    if (!setRequestFailed) {
      setHasError("");
    }
  }, [requestFailed]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(1, "Minimum 1 character").required("Password is required"),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      // authentication
      const r1 = await authService.login(values);
      const accessToken = r1.data.token;
      let payload = { ...r1.data.user, accessToken };
      props.dispatch(addUser(payload));
      blockUI.current.open(false);
      history.push("/dashboard");
      
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      setHasError({ message: e.response.data.message });
    }
  };

  return (
    <Container component="main" maxWidth="lg" className={loginStyle.bgMain}>
      <Typography component="div" className={loginStyle.panForm}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
        >
          <img src={logo} alt="DashboardPublic" className={loginStyle.logo}/>
        </IconButton>
        <CssBaseline />
        <Typography component="div">
          {requestFailed && (
            <p className={loginStyle.formError} align="center">{hasError.message}</p>
          )}
        </Typography>
        {locationState && (
          <Collapse in={open}>
            <Alert severity="success" color="info" className={loginStyle.alert} onClose={() => { setOpen(false); }}>
              {locationState.message}
            </Alert>
          </Collapse>
        )}
        <Typography component="div" className={loginStyle.formMain}>
          <Formik
            initialValues={{
              password: "",
              showPassword: false,
              email: "",
            }}
            onSubmit={(values) => {
              onSubmit(values).then(() => { });
            }}
            validationSchema={LoginSchema}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                setFieldValue,
              } = props;
              return (
                <Form>
                  <TextField
                    margin="normal"
                    className={classNames(loginStyle.inputEmail)}
                    required
                    fullWidth
                    name="email"
                    id="email"
                    autoComplete="email"
                    autoFocus
                    value={values.email}
                    type="email"
                    variant="standard"
                    helperText={
                      errors.email && touched.email ? errors.email : ""
                    }
                    error={!!(errors.email && touched.email)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email"
                  />

                  <Input
                    margin="none"
                    className={classNames(loginStyle.inputPassword)}
                    required
                    fullWidth
                    name="password"
                    id="standard-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    error={!!(errors.password && touched.password)}
                    inputProps={{ className: loginStyle.input }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          className={loginStyle.icoShowPassword}
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setFieldValue("showPassword", !values.showPassword);
                          }}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && touched.password ? (
                    <p className={classNames(loginStyle.formPasswordError)}>
                      {errors.password}
                    </p>
                  ) : null}
                  <Grid container justify="flex-end" className={loginStyle.gridForgotPassword}>
                    <Grid item>
                      <Link to="#" variant="body2" className={loginStyle.link}>
                      </Link>
                    </Grid>
                  </Grid>
                  <div className={loginStyle.wrapperBtnSubmit}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={loginStyle.btnSubmit}
                    >
                      Get started
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Typography>
      </Typography>
    </Container>
  )
};

export default connect(null)(LoginPage);
