import { makeStyles } from '@mui/styles';

export const LoginStyles = makeStyles(() => ({
  bgMain: {
    height: "100vh",
    backgroundSize: "cover",
    maxWidth: "100%"
  },
  wrapperBtnSubmit:{
    textAlign: 'center'
  },
  btnSubmit: {
    margin: "3px 0 2px 0",
    borderRadius: "4px",
    height: "37px",
    backgroundColor:'#80BB57 !important',
    color:'white',
    fontWeight: 'bold !important',
    width: '155px !important',
    "&:hover": {
      backgroundColor: "#80BB60 !important",
    }
  },
  panPaper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "fixed"
  },
  logo: {
    width: '55%'
  },
  panForm: {
    backgroundColor: "white",
    padding: "50px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    boxShadow: '0px 6px 8px 4px rgb(36 35 35 / 15%)',
    borderRadius: '4px',
  },
  formMain: {
    width: "80%",
    marginTop: "1px",
    transform: "translate(-50%, -50%)",
    top: "120px",
    left: "50%",
    position: "relative",
  },
  formError: {
    color: "#f44336",
    fontSize: "0.96rem",
    margin: "0",
    marginTop: "3px",
    lineHeight: "1.66",
    letterSpacing: "0.03333em",
  },
  formPasswordError: {
    color: "#d32f2f",
    fontSize: "0.75rem",
    margin: "0",
    marginTop: "3px",
    lineHeight: "1.66",
    letterSpacing: "0.03333em",
    fontWeight: 400
  },
  gridForgotPassword: {
    marginTop: "15px",
    marginBottom: "30px",
    fontSize: "14px"
  },
  inputEmail: {
    "& .MuiInputBase-input": {
      color: "#484646",
      WebkitBoxShadow: "0 0 0 1000px #e0e0e0 inset",
    }
  },
  inputPassword: {
    marginTop: "10px",
  },
  input: {
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #e0e0e0 inset",
    }
  },
  inputRecover: {
    marginTop: "20px",
  },
  btnSendReset: {
    marginTop: "20px"
  },
  alignItemsAndJustifyContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoShowPassword: {
    '& .MuiSvgIcon-root': {
      fontSize: 22
    }
  },
  link: {
    color: "#484646",
    textDecoration: 'none'
  },
  alert:{
    align: 'center'
  }
}));
