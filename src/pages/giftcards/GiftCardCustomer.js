import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { GiftCardService } from '../../services';
import * as Yup from 'yup';
import {
  Grid, 
  TextField, 
  Button, 
  Avatar,
  Tooltip 
} from '@mui/material';
import { Formik } from 'formik';
import { GiftCardCustomerPublicStyles } from './styles/giftcard-public-style';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import dateFormat from 'dateformat';
import logo from "../../assets/images/giftcard_logo.png";
import logoKdosh from "../../assets/images/kdosh_logo.png";
import { connect } from 'react-redux';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
    confirm: 'ACEPTAR',
  },
  onConfirm: () => {},
};

const giftCardService = new GiftCardService();

const GiftCardCustomer = (props) => {

  const { user } = props;
  const history = useHistory();
  const modalStyle = ModalCustomStyles();
  const giftStyle = GiftCardCustomerPublicStyles();
  const [card, setCard] = useState({});
  const { blockUI, dialogUI } = useUI();
  const [requestFailed, setRequestFailed] = useState('');
  const [partnersAvailable, setPartnersAvailable] = useState([]);
  const [qrBuy, setQrBuy] = useState();
  const [partnerSelected, setPartnerSelected] = useState({});
  const [amountMax, setAmountMax] = useState(100);
  const [viewAllQr, setViewAllQr] = useState(true);
  const [tickets, setTickets] = useState([]);
  const isMobile = /mobile|android/i.test(navigator.userAgent);

  const baseValuesTicket = {
    amount: ''
  }
  
  const [initialValuesTicket, setInitialValuesTicket] = useState(baseValuesTicket);

  const validationSchemaTicket = Yup.object({
    amount: Yup
      .number()
      .min(1, 'Debe ser al menos S/1')
      .max(amountMax, `No debe superar los S/${amountMax}`)
      .required('Obligatorio'),
  });

  const handleConfirmGenerateTicket = async (values) => {
    try {
      setQrBuy({});
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        onConfirm: () => {},
      };
      dialogUI.current.open(
        '',
        'Ticket generado',
        dlgSettings
      );
      blockUI.current.open(true);
      const body = {
        giftcard: user.giftcard,
        partner: partnerSelected.uid,
        amount: values.amount
      }
      giftCardService.getAccessToken();
      const r1 = await giftCardService.generateQr(body);
      setCard({
        ...card,
        amountAvailable: r1.data.amountAvailable
      });
      setAmountMax(r1.data.amountAvailable);
      setQrBuy({
        img: r1.data.url,
        namePartner: partnerSelected.name,
        amountTicket: values.amount
      });

      let newTickets = [{
        amount: values.amount,
        qrImage: r1.data.url,
        partner: {
          name: partnerSelected.name
        },
        createdAt: r1.data.date,
        status: true
      }, ...tickets];
      setTickets(newTickets);
      
      setInitialValuesTicket({amount:''});
      blockUI.current.open(false);
    } catch (e) {
      setQrBuy({});
      blockUI.current.open(false);
      dialogUI.current.open(
        'DENEGADO',
        e.response.data.message,
        dlgSettings
      );
    }
  }

  const onSubmitTicket = async (values) => {
    try {
      setQrBuy({});
      dlgSettings = {
        ...dlgSettings,
        confirm: true,
        onConfirm: () => {
          handleConfirmGenerateTicket(values);
        },
      };
      dialogUI.current.open(
        'ALERTA',
        '¿Está seguro?',
        dlgSettings
      );
    } catch (e) {
      setQrBuy({});
      blockUI.current.open(false);
    }
  }

  const reloadDataMyGiftcard = async (myGiftcard) => {
    try {
      blockUI.current.open(true);
      setRequestFailed('');
      giftCardService.getAccessToken();
      const { data } = await giftCardService.reloadDataMyGiftcard({
        giftcard: user.giftcard
      });
      setCard(data.giftcard);
      setTickets(data.tickets);
      setAmountMax(data.giftcard.amountAvailable)
      setPartnersAvailable(data.partners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(e.response.data.message);
    }
  };

  useEffect(() => {
    (async function init() {
      await reloadDataMyGiftcard();
    })();
  }, []);

  useEffect(() => {
    if(!isMobile){
      history.push("/home");
    }
  }, []);
  

  return (
    <Grid container className={giftStyle.wrapperGiftCard}>
      <Grid item xs={12} className='failedRequest'>
        {requestFailed}
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
            <img src={logoKdosh} alt="imgGiftcard" style={{width:'64%'}}/>
          </Grid>
          <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
            <img src={logo} alt="imgGiftcard" style={{width:'42%'}}/>
          </Grid>
          <Grid item xs={12} style={{textAlign:'center', marginTop: '26px', marginBottom: '7px'}}>
            BIENVENIDO/A {card.user?.name} !
          </Grid>
          <Grid item xs={12}>
            <div className={modalStyle.wrapperCustomerGiftCard}>
              <div className={modalStyle.wrapperViewGiftcard}>
                <article className="gift-card animate__animated animate__rotateInDownLeft">
                  <div className="gift-card__image">
                  </div>
                  <section className="gift-card__content">
                    <div className="gift-card__amount">S/.{card.amountAvailable}</div>
                    <div className="gift-card__amount-remaining">Monto Inicial: S/{card.amount}</div>    
                    <div className="gift-card__code">{card.code}</div>
                    <div className="gift-card__msg">Código de identificación</div>
                  </section>
                </article>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{textAlign:'center', marginTop: '30px'}}>
          <Grid container>
            <Grid item xs={12}>
              GENERAR QR DE CONSUMO
            </Grid>
            <Grid item xs={12} style={{textAlign: 'center', marginTop: '32px'}}>
              <Formik
                initialValues={initialValuesTicket}
                validationSchema={validationSchemaTicket}
                onSubmit={onSubmitTicket}
                enableReinitialize={true}
              >
                {(props) => {
                  const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  } = props;
                  return(
                    <div>
                      <Grid item xs={12}>
                        <Grid container className={giftStyle.wrapperAmount}>
                          <Grid item xs={12} className='title'>
                            <label>MONTO</label>
                          </Grid>
                          <Grid item xs={4}></Grid>
                          <Grid item xs={4} className='texfield'>
                            <TextField
                              type="number"
                              id="amount"
                              amount="amount"
                              autoComplete="amount"
                              value={values.amount || ''}
                              className={modalStyle.texfield}
                              placeholder="S/_____"
                              size='small'
                              margin="normal"
                              required
                              fullWidth
                              variant="outlined"
                              helperText={
                                errors.amount && touched.amount ? errors.amount : ""
                              }
                              error={!!(errors.amount && touched.amount)}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{textAlign: 'center'}}
                            />
                          </Grid>
                          <Grid item xs={4}></Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} className={giftStyle.wrapperPartners}>
                        {
                          partnersAvailable.map((partner, index)=>(
                            <Grid key={`partner${index}`} container>
                              <Grid item xs={5}>
                                <Tooltip title={partner.name} placement="right">
                                  <Avatar
                                    alt={partner.name}
                                    src={partner.logo}
                                    sx={{ width: 56, height: 56 }}
                                  />
                                </Tooltip>
                              </Grid>
                              <Grid item xs={7} style={{paddingTop: '6px'}}>
                                <Button
                                  variant="contained"
                                  size="large"
                                  onClick={()=>{
                                    setPartnerSelected(partner);
                                    handleSubmit();
                                  }}
                                  startIcon={<QrCodeScannerIcon />}
                                  className={giftStyle.btnGenerateQr}
                                >
                                  CLIC AQUÍ 
                                </Button>
                              </Grid>
                            </Grid>
                          ))
                        }
                      </Grid>
                    </div>
                  );
                }}
              </Formik>
            </Grid>
            {
              (viewAllQr)
                &&
                  tickets.map((ticket, index)=>(
                    <Grid key={`ticket${index}`} item xs={6} style={{textAlign:'center', marginTop: '20px'}}>
                      <div className={giftStyle.wrapperQr} style={(ticket.status) ? {borderColor:'green'} : {borderColor:'red'}}>
                        <img src={ticket.qrImage} style={{width: '100%'}}/>
                        <div className='partner'>
                          {ticket.partner?.name}
                        </div>
                        <div className='amount'>
                          S/{ticket.amount}
                        </div>
                        <div 
                          className='status'
                          style={(ticket.status) ? {color:'green'} : {color:'red'}}
                        >
                          {
                            (ticket.status) ? 'DISPONIBLE' : 'CANJEADO'
                          }
                        </div>
                        <div style={{
                          fontSize: '11px',
                          backgroundColor: '#7a7a7a',
                          color: 'white',
                          marginTop: '7px',
                          padding: '2px',
                        }}>
                          {
                            dateFormat(new Date(ticket.createdAt), "dd-mm-yy HH:MM")
                          }
                        </div>
                      </div>
                    </Grid>
                  ))
            }
          </Grid>
        </Grid>
      </Grid>  
    </Grid>
  )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(GiftCardCustomer);
