import { makeStyles } from "@mui/styles";

export const GiftCardCustomerPublicStyles = makeStyles((theme) => ({
  wrapperGiftCard: {
    padding: '24px',
    '& .failedRequest': {
      color: 'red',
      fontSize: '12px',
      textAlign: 'center',
      paddingBottom: '31px',
    }
  },
  wrapperQr: {
    width: '120px',
    margin: '20px auto',
    border: "solid 0.3px #BFACAA",
    borderRadius: '4px',
    padding: '0px',
    marginBottom: '5px',
    paddingBottom: '18px',
    '& .partner': {
      fontFamily: "'Economica', sans-serif !important",
      fontSize: "18px"
    },
    '& .amount': {
      fontFamily: "'Economica', sans-serif !important"
    },
    '& .status': {
      fontFamily: "'Economica', sans-serif !important",
      paddingTop: '9px'
    }
  },
  btnGenerateQr: {
    backgroundColor: '#73937E !important'
  },
  btnViewQR: {
    backgroundColor: '#5B2E48 !important',
    color: 'white'
  },
  wrapperAmount: {
    marginBottom: '31px',
    '& .title': {
      fontSize: '13px',
      marginBottom: '11px',
      color: '#5b2e48',
    },
    '& .textfield': {
      marginBottom: '30px'
    }
  },
  wrapperPartners: {
    paddingLeft: '32px'
  },
  titleGc: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '18px !important',
    fontFamily: "'Press Start 2P', cursive !important",
  },
  wrapperNotTickets: {
    textAlign: 'center',
    backgroundColor: '#8080802b',
    padding: '26px',
    borderRadius: '14px',
    fontSize: '14px',
    textTransform: 'uppercase',
  }
}));