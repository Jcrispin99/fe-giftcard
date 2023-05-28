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
  IconButton,
  Input,
  InputAdornment,
  Visibility,
  VisibilityOff
} from "../../components/shared/MaterialUI";

import { connect } from "react-redux";
import store from "../../redux/store";
import { useHistory, Link } from "react-router-dom";
import { useUI } from "../../app/context/ui";
import AuthService from "../../services/AuthService";
import logo from "../../assets/images/giftcard_logo.png";
import logoKdosh from "../../assets/images/kdosh_logo.png";
import { LoginStyles } from "../../assets/css/login-style";
import _ from "lodash";

const CustomerNewPassword = (props) => {
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const history = useHistory();
  let locationState = false;
  if (!_.isUndefined(props.location)) {
    locationState = _.isUndefined(props.location.state) ? false : props.location.state;
  }

  if(!locationState){
    history.push('/gift-card-customer');
  }

  const loginStyle = LoginStyles();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { blockUI } = useUI();
  

  const state = store.getState();
  const accessToken = state.user.accessToken;
  if (accessToken) {
    history.push("/my-giftcard");
  }

  const authService = new AuthService();

  useEffect(() => {
    if (!setRequestFailed) {
      setHasError("");
    }
  }, [requestFailed]);

  const LoginSchema = Yup.object().shape({
    password: Yup.string().min(8, "Mínimo 8 caracteres").required("Obligatorio"),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      const res = await authService.newPassword({...values, identify: locationState.user.identify});
      history.push({
          pathname: '/gift-card-customer',
          state: { 
            message: res.data.msg,
            giftcard: locationState.giftcard
          }
      });
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      setHasError({ message: e.response.data.msg });
    }
  };

  return (
    <Container component="main" maxWidth="lg" className={loginStyle.bgMain}>
      <Typography component="div" className={(isMobile) ? loginStyle.panFormMobile : loginStyle.panForm}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
        >
          <Grid container>
            <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
              <img src={logoKdosh} alt="imgGiftcard" style={{width:'64%'}}/>
            </Grid>
            <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
              <img src={logo} alt="imgGiftcard" style={{width:'42%'}}/>
            </Grid>
          </Grid>
        </IconButton>
        <CssBaseline />
        <Typography component="div">
          {requestFailed && (
            <p className={loginStyle.formError} align="center">{hasError.message}</p>
          )}
        </Typography>
        {
          (!isMobile)
            &&
              <div className={loginStyle.infoDesktop}>POR FAVOR INGRESAR AL SISTEMA DESDE SU CELULAR. GRACIAS !!</div>
        }
        <Typography component="div" className={loginStyle.formMain}>
          
          {
            (isMobile)
              &&
                <Formik
                  initialValues={{
                    password: "",
                    showPassword: false,
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
                          placeholder="Crea tu nueva contraseña"
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
                            className={loginStyle.btnSubmit}
                          >
                            INICIAR
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
          }
        </Typography>
      </Typography>
    </Container>
  )
};

export default connect(null)(CustomerNewPassword);
