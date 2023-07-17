import { makeStyles } from "@mui/styles";

export const EmployeeStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: 'none'
  },
  root: {
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
      display: "none"
    }
  },
  checkboxBlue: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: 'blue',
      '&:hover': {
        backgroundColor: 'gray'
      },
    }
  },
  btnCreate: {
    color: "#2c7dcf",
    marginBottom: "20px",
    borderColor: "#3b94eeb3",
    '&:hover': {
      color: "white",
      backgroundColor: "#3b94ee",
      borderColor: "white",
    }
  },
  title: {
    textAlign: "center",
    fontFamily: 'Barlow Condensed',
    fontSize: '26px !important',
    fontWeight: 'bold !important',
    backgroundColor: '#0080002e',
    borderRadius: '13px',
    padding: '7px',
    marginBottom: '26px'
  },
  giftcardGreen: {
    backgroundColor: '#519c51',
    padding: '4px 16px',
    marginRight: '4px',
    borderRadius: '9px',
    color: 'white',
  },
  giftcardOrange: {
    backgroundColor: 'orange',
    padding: '4px 16px',
    marginRight: '4px',
    borderRadius: '9px',
    color: 'white',
  },
  giftcardRed: {
    backgroundColor: '#c32424',
    padding: '4px 16px',
    marginRight: '4px',
    borderRadius: '9px',
    color: 'white',
  },
}));