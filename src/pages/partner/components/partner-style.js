import { makeStyles } from "@mui/styles";

export const PartnerStyles = makeStyles((theme) => ({
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
    fontSize: '31px',
    fontWeight: 'bold',
  }
}));