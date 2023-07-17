import { makeStyles } from "@mui/styles";

export const ModalCustomStyles = makeStyles((theme) => ({
  root:{
    color: 'white !important',
    width: '100%',
    background: 'black !important',
    borderRadius: '7px',
    height: '62px',
    '& .Mui-selected': {
      color: '#20ff5a',
    },
    '& .MuiButtonBase-root':{
      color: 'white'
    }
  },
  paperModal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6),
    outline: 'none',
    overflowX: 'hidden',
    overflowY: 'scroll',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: "26px",
    fontSize: "16px",
    '& .title': {
      textAlign: 'center',
      marginBottom: '33px',
      fontWeight: 'bold',
      fontFamily: 'Barlow Condensed',
    },
    '& .d-flex': {
        display: 'flex',
    },
    '& .mar-t-1': {
        marginTop: '15px',
    },
    '& .text-center': {
        textAlign: 'center',
    },
    '& .gift-card': {
        borderRadius: '10px',
        background: '#fafafa',
        width: '430px',
        color: '#3d3d3d',
        fontFamily: 'sans-serif',
        display: 'flex',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)', 
    },
    '& .gift-card__image': {
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
        flex: 1,
        maxWidth: '150px',
        backgroundSize: 'cover',
        backgroundImage: 'url(https://cdn.shopify.com/s/files/1/2504/3282/files/annie-spratt-102799-unsplash.jpg?15904179471993750892)',
    },
    '& .gift-card__content': {
        padding: '30px 20px',
        //flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    '& .gift-card__msg': {
        fontSize: '10px',
        display: 'block',
        marginTop: '10px',
    },
    '& .gift-card__details': {
        marginTop: 'auto',
        alignItems: 'center',
        lineHeight: 1,
    },
    '& .gift-card__code': {
        display: 'inline-block',
        background: 'white',
        color: 'black',
        padding: '10px 13px',
        marginTop: '20px',
        fontSize: '20px',
        border: '1px solid #e3e3e3',
    },
    '& .gift-card__amount': {
        fontSize: '45px',
    },
    '& .gift-card__amount-remaining': {
        fontSize: '12px',
        marginTop: '7px',
    }
  },
  titleAlarm: {
    fontSize: '34px',
    fontWeight: 'bold',
    marginBottom: '21px',
  },
  wrapperList: {
    height: '300px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    width: '100%',
    '& .title': {
      fontSize: '17px',
      marginBottom: '17px'
    },
    '& .rows': {
      marginBottom: '20px',
    },
    '& .content': {
      border: 'solid 1px #8080804d',
      borderRadius: '8px',
      padding: '7px 16px',
      cursor: 'pointer',
      '& .titleDate': {
        fontSize: '11px',
        fontWeight: 'bold',
        paddingRight: '30px',
        fontFamily: 'Roboto',
      },
      '& .titleHour': {
        fontSize: '11px',
        fontWeight: 'bold'
      },
      '& .fullName': {
        fontSize: '12px',
        fontWeight: 'bold'
      },
      '& .detail': {
        fontSize: '14px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }
    }
  },
  checkboxStatus: {
    paddingTop: '15px',
    paddingLeft: '0px'
  },
  wrapperButtonsAlarm: {
    paddingTop: '41px',
    '& .buttonFirst': {
      loat: 'left',
      marginRight: '17px',
    }
  },
  buttonActions: {
    float: 'left',
    marginRight: '18px',
  },
  wrapperNotAlarmsList: {
    border: 'solid 0.5px #80808052',
    padding: '17px 0px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#808080bf',
  },
  paperModal_sm: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6),
    outline: 'none',
    '& .wrapperHourDate': {
      marginBottom: '10px',
      fontWeight: 'bold',
      '& .date': {
        marginRight: '36px'
      }
    },
    '& .name': {
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    '& .detail': {
      textAlign: 'justify',
      marginBottom: '10px',
    },
    '& .titleSnooze': {
      float: 'left',
      marginRight: '37px',
      paddingTop: '11px',
    },
    '& .wrapperButtonAction': {
      paddingLeft: '55px',
      marginTop: '17px',
      '& .buttonClose':{
        float: 'left',
        marginRight: '18px',
        backgroundColor: '#dadadac4 !important',
        color: 'black !important',
        fontWeight: 'bold',
        width: '94px !important'
      }
    }
  },
  button: {
    marginRight: '19px'
  },
  grdItem: {
    paddingTop: '32px !important',
    '& .optional': {
      fontSize: '8px',
      color: '#1a76d2'
    }
  },
  texfield: {
    margin: '0px !important',
    '& #amount, #code': {
      textAlign: 'center'
    },
    '& #amount-helper-text':{
      textAlign: 'center',
      paddingTop: '4px'
    },
    '& .MuiInputBase-inputSizeSmall': {
      textAlign: 'center'
    }
  },
  messageErrorLoginCustomer:{
    textAlign: 'center',
    fontSize: '13px',
    color: 'red',
  },
  formError: {
    fontSize: '15px',
    color: 'red',
    marginBottom: '40px',
  },
  wrapperInfoGiftcard: {
    borderRadius: '10px',
    marginTop: '20px !important',
    textAlign: 'center',
    fontSize: '14px',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    padding: '2px 0px',
    fontWeight: 'bold'
  },
  wrapperCreateGiftcard: {
    textAlign: 'center',
    marginTop: '21px !important'
  },
  wrapperViewGiftcard:{
    marginTop: '23px !important',
    width: '321px',
    overflow: 'auto',
    '& .card6': {
      textAlign: '-webkit-center !important',
    },
    '& .gift-card': {
      borderRadius: '10px',
      // background: '#fafafa',
      width: '430px',
      // color: '#3d3d3d',
      fontFamily: 'sans-serif',
      display: 'flex',
      boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)', 
    },
    '& .gift-card__image': {
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      flex: 1,
      maxWidth: '150px',
      backgroundSize: 'cover',
      backgroundImage: 'url(https://cdn.shopify.com/s/files/1/2504/3282/files/annie-spratt-102799-unsplash.jpg?15904179471993750892)',
    },
    '& .gift-card__content': {
      padding: '30px 20px',
      //flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    '& .gift-card__msg': {
      fontSize: '10px',
      display: 'block',
      marginTop: '10px',
    },
    '& .gift-card__details': {
      marginTop: 'auto',
      alignItems: 'center',
      lineHeight: 1,
    },
    '& .gift-card__code': {
      display: 'inline-block',
      background: 'white',
      color: 'black',
      padding: '10px 13px',
      marginTop: '20px',
      fontSize: '12px',
      border: '1px solid #e3e3e3',
      width: '105px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .gift-card__amount': {
      fontSize: '45px',
    },
    '& .gift-card__amount-remaining': {
      fontSize: '12px',
      marginTop: '7px',
    },
    '& .card3': {
      borderRadius: '10px',
      margin: '0px 13px',
      marginLeft: '43px',
      marginBottom: '9px',
      padding: '2px',
      '& .infoCard': {
        padding: '24px',
        lineHeight: '35px',
        fontSize: '13px',
      },
      '& .btnViewBuys': {
        textAlign: 'end',
        paddingTop: '7px',
        paddingRight: '26px',
      }
    },
    '& .card2': {
      borderRadius: '10px',
      textAlign: 'center',
      backgroundColor: '#1a76d233',
      height: '52px'
    }
  },
  wrapperCustomerGiftCard: {
    textAlign: '-webkit-center'
  },
  ticket: {
    textAlign: 'center',
    margin: '20px',
    padding: '20px',
    borderRadius: '15px',
    fontSize: '16px',
    backgroundColor: '#8EC5FC',
    backgroundImage: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  wrapperNotBuys: {
    border: 'solid 0.5px gray', 
    textAlign:'center',
     marginTop: '20px', 
    borderRadius: '10px', 
    padding: '40px', 
    color: 'gray'
  },
  inputCustom: {
    textAlign: 'center'
  },
  wrapperSearchCustomer: {
    marginBottom: '15px',
    paddingTop: '15px',
    backgroundColor: '#6895a217',
    paddingBottom: '19px',
    borderRadius: '14px',
  }
}));
