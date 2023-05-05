import { makeStyles } from "@mui/styles";

export const ListStyles = makeStyles(() => ({
  dataGrid: {
    padding: "6px 15px 0px 18px",
    "& .MuiCheckbox-root": {
      color: "#10AA39",
    },
    "& .MuiDataGrid-columnSeparator": {
      color: "transparent",
    },
    "& .MuiDataGrid-colCellTitle": {
      color: "#2F3A4A",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '25px',
    },
    "& .MuiDataGrid-cell": {
      color: "#2F3A4A",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: '14px',
      lineHeight: '16px',
    },
  },
  containerNotPay: {
    color: 'white',
    padding: '10px 50px',
    borderRadius: '12px',
    fontWeight: 'bold',
    backgroundColor: 'red'
  },
  containerPay: {
    color: 'white',
    padding: '10px 50px',
    borderRadius: '12px',
    fontWeight: 'bold',
    backgroundColor: 'green'
  }
}));
