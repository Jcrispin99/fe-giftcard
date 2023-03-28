import { makeStyles } from '@mui/styles';

export const WizardStyles = makeStyles((theme) => ({
  ctnInner: {
    fontFamily: [
      'Roboto',
      'Arial'
    ].join(','),
    color: "#2F3A4A",
    "& label": {
      fontSize: 16
    }
  },
  chkCustom: {
    margin: "20px 0 0 40px",
    "& .MuiFormControlLabel-label": {
      fontSize: 16
    }
  },
  inputCustom: {
    minWidth: 200,
  },
  title: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "15px",
    lineHeight: "16px",
  },
  label: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    paddingBottom: "10px",
  },
  alert: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: theme.palette.secondary.main,
    "& .MuiAlert-icon": {
      color: theme.palette.secondary.main,
    }
  },
  formControl: {
    marginTop: theme.spacing(1),
    minWidth: 320,
    maxWidth: '100%',
  },
  grdAnswer: {
    marginTop: 28,
  },
  inputCardNumber: {
    width: 65,
    marginRight: 10
  },
  selectMonth: {
    width: 130,
    marginRight: 10
  },
  inputCardName: {
    width: 200,
    marginRight: 10
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootModal: {
    height: 300,
    flexGrow: 1,
    minWidth: 300,
    transform: 'translateZ(0)',
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  paperModal: {
    position: 'absolute',
    width: 550,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  wrapperLogout:{
    color: 'black',
    fontSize: '15px',
    marginRight: '83px'
  },
  wrapperTable: {
    height: 580, 
    width: '100%', 
    backgroundColor: 'white', 
    marginTop: '6px'
  }
}));
