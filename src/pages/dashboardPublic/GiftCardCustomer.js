import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { AuthService } from '../../services';
import * as Yup from 'yup';
import { 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { Formik } from 'formik';
import { GiftCardCustomerPublicStyles } from './styles/giftcard-public-style';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DownloadingIcon from '@mui/icons-material/Downloading';
import dateFormat from 'dateformat';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../../assets/images/giftcard_logo.png";
import logoKdosh from "../../assets/images/kdosh_logo.png";

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
    confirm: 'ACEPTAR',
  },
  onConfirm: () => {},
};

const authService = new AuthService();

const GiftCardCustomer = () => {

  const imagenRef = useRef(null);
  const formikRef = useRef(null);
  const history = useHistory();
  const modalStyle = ModalCustomStyles();
  const giftStyle = GiftCardCustomerPublicStyles();
  const [card, setCard] = useState({});
  const { blockUI, dialogUI } = useUI();
  const location = useLocation();
  const [giftcardValidate, setGiftcardValidate] = useState(false);
  const [requestFailed, setRequestFailed] = useState('');
  const [statusGenerateBtn, setStatusGenerateBtn] = useState();
  const [timeAvailable, setTimeAvailable] = useState();
  const [partnersAvailable, setPartnersAvailable] = useState([]);
  const [qrBuy, setQrBuy] = useState();
  const [partnerSelected, setPartnerSelected] = useState({});
  const [amountMax, setAmountMax] = useState(100);
  const [viewAllQr, setViewAllQr] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [viewBtnLogin, setViewBtnLogin] = useState(false);
  const [cardEntered, setCardEntered] = useState('');
  const [messageErrorLoginCustomer, setMessageErrorLoginCustomer] = useState(false);
  const isMobile = /mobile|android/i.test(navigator.userAgent);


  const baseValues = {
    code: '',
    card: '',
  };

  const baseValuesTicket = {
    amount: ''
  }
  
  const [initialValues, setInitialValues] = useState(baseValues);
  const [initialValuesTicket, setInitialValuesTicket] = useState(baseValuesTicket);

  const validationSchema = Yup.object({
    code: Yup
      .string()
      .min(6,'6 dígitos')
      .max(6,'6 dígitos')
      .required('Código obligatorio para generar tickets de consumo')
  });

  const validationSchemaTicket = Yup.object({
    amount: Yup
      .number()
      .min(1, 'Debe ser al menos S/1')
      .max(amountMax, `No debe superar los S/${amountMax}`)
      .required('Obligatorio'),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed('');
      const { data } = await authService.loguinMyCard({...values, id: cardEntered });
      setGiftcardValidate(true);
      setCard(data.giftcard);
      localStorage.setItem('giftcard',JSON.stringify(data.giftcard));
      setTickets(data.tickets);
      setAmountMax(data.giftcard.amountAvailable)
      setPartnersAvailable(data.partners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed('Código no válido');
    }
  };

  const handleConfirmGenerateTicket = async (values) => {
    try {
      setQrBuy({});
      blockUI.current.open(true);
      const id = location.pathname.split('/gift-card-customer/')[1];
      const body = {
        id,
        partner: partnerSelected.uid,
        code: card.securityCodeGenerated,
        securitySecretBase64: card.securitySecretBase64,
        amount: values.amount
      }

      const r1 = await authService.generateQr(body);
      setViewAllQr(false);
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

  const handleStatusBtnVerify = (timeLeft) => {
    let time = timeLeft + 1;
    if(!timeLeft){
      localStorage.setItem("timeLeft", 30);
      time = 31;
    }
    const timer = setTimeout(() => {
      setStatusGenerateBtn(false);
      localStorage.setItem("statusGenerateBtn", false);
    }, time * 1000);
    return () => clearTimeout(timer);
  };

  const handleGenerateCodeTicket = async () => {
    try {
      blockUI.current.open(true);
      setViewBtnLogin(true);
      await authService.mycard({id:cardEntered});
      setStatusGenerateBtn(true);
      localStorage.setItem("statusGenerateBtn", true);
      handleStatusBtnVerify();
      intervalTimeAvailable();
      blockUI.current.open(false);
      dialogUI.current.open(
        'SOLICITUD ENVIADA',
        'Ingrese el código que le llegó al celular',
        dlgSettings
      );
    } catch (error) {
      setViewBtnLogin(false);
      setCardEntered('');
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        onConfirm: () => {},
      };
      dialogUI.current.open(
        'NO PERMITIDO',
        'Ingrese bien su tarjeta o comuníquese con el administrador',
        dlgSettings
      );
      if (formikRef.current) {
        formikRef.current.resetForm({
          values: {
            code: '',
            card: ''
          }
        });
      }
    }
  };

  const intervalTimeAvailable = () => {
    let contador = localStorage.getItem("timeLeft");
    const intervalo = setInterval(() => {
      let num = contador--;
      setTimeAvailable(num);
      localStorage.setItem("timeLeft", num);
      if(num === 0){
        setTimeAvailable('');
        clearInterval(intervalo);
      }
    }, 1000);
  };

  const downloadQr = () => {
    const img = imagenRef.current;
    const urlImagen = img.src;
    const linkTemp = document.createElement('a');
    linkTemp.href = urlImagen;
    linkTemp.setAttribute('download', 'qr');
    linkTemp.click();
  };

  const reloadDataMyGiftcard = async (myGiftcard) => {
    try {
      blockUI.current.open(true);
      setRequestFailed('');
      const { data } = await authService.reloadDataMyGiftcard({
        giftcard: myGiftcard.code,
        code: myGiftcard.securityCodeGenerated,
        base64: myGiftcard.securitySecretBase64
      });
      setGiftcardValidate(true);
      setCard(data.giftcard);
      localStorage.setItem('giftcard',JSON.stringify(data.giftcard));
      setTickets(data.tickets);
      setAmountMax(data.giftcard.amountAvailable)
      setPartnersAvailable(data.partners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed('Código no válido');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    let statusGenerateBtn = localStorage.getItem('statusGenerateBtn');
    const timeLeft = Number(localStorage.getItem('timeLeft'));
    let myGiftcard = JSON.parse(localStorage.getItem('giftcard'));

    if(myGiftcard){
      reloadDataMyGiftcard(myGiftcard);
    }

    if(statusGenerateBtn === "true"){
      statusGenerateBtn = true;
    }else{
      statusGenerateBtn = false;
    }

    if(statusGenerateBtn){
      setStatusGenerateBtn(statusGenerateBtn);
      handleStatusBtnVerify(timeLeft);
      intervalTimeAvailable();
    }
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
      {
        (!giftcardValidate)
          ?
            <Grid item xs={12}>
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
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
                    <div style={{padding: '25px'}}>
                      <Grid container spacing={3} className='wrapperForm'>
                        <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
                          <img src={logoKdosh} alt="imgGiftcard" style={{width:'64%'}}/>
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center', paddingTop: '0px'}}>
                          <img src={logo} alt="imgGiftcard" style={{width:'42%'}}/>
                        </Grid>
                        <Grid item xs={12}>
                          {
                            (viewBtnLogin)
                              ?
                                <TextField
                                  type="text"
                                  id="code"
                                  code="code"
                                  autoComplete="code"
                                  value={values.code || ''}
                                  className={modalStyle.texfield}
                                  placeholder="Ingrese el código que le llegó al celular"
                                  size='small'
                                  margin="normal"
                                  required
                                  fullWidth
                                  variant="outlined"
                                  helperText={
                                    errors.code && touched.code ? errors.code : ""
                                  }
                                  error={!!(errors.code && touched.code)}
                                  inputProps={{ 
                                    maxLength: 10,
                                    pattern: "[0-9]*"
                                  }}
                                  onChange={(e)=>{
                                    const enteredValue = e.target.value;
                                    if (!isNaN(Number(enteredValue))) {
                                      handleChange(e);
                                    }
                                  }}
                                  onBlur={handleBlur}
                                />
                              :
                                <TextField
                                  type="text"
                                  id="card"
                                  autoComplete="card"
                                  value={values.card || ''}
                                  className={modalStyle.texfield}
                                  placeholder="Escriba todo el código de su tarjeta"
                                  size='small'
                                  margin="normal"
                                  required
                                  fullWidth
                                  variant="outlined"
                                  helperText={
                                    errors.card && touched.card ? errors.card : ""
                                  }
                                  error={!!(errors.card && touched.card)}
                                  inputProps={{ 
                                    maxLength: 10,
                                    pattern: "[0-9]*"
                                  }}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    const numericValue = enteredValue.replace(/\D/g, "");
                                    setCardEntered(numericValue);
                                    if (!isNaN(Number(enteredValue))) {
                                      handleChange(e);
                                    }
                                    setMessageErrorLoginCustomer(false);
                                  }}
                                  onBlur={()=>{
                                    if(cardEntered.length < 10){
                                      setMessageErrorLoginCustomer(true);
                                    }
                                  }}
                                />

                          }
                        </Grid>
                        {
                          (messageErrorLoginCustomer)
                            &&
                              <Grid item xs={12} className={modalStyle.messageErrorLoginCustomer}>
                                Ingrese los 10 dígitos de su tarjeta
                              </Grid>
                        }
                      </Grid>
                      <Box pb={5}/>
                      <Grid container justifyContent="center">
                        {
                          (viewBtnLogin)
                            ?
                              <Button
                                variant="contained"
                                size="large"
                                onClick={()=>{handleSubmit()}}
                                className={giftStyle.btnGenerateQr}
                              >
                                INGRESAR
                              </Button>
                            :
                              (cardEntered.length === 10)
                                ?
                                  <Button
                                    variant="contained"
                                    size="large"
                                    className={modalStyle.button}
                                    onClick={handleGenerateCodeTicket}
                                    style={{
                                      backgroundColor: '#808080ba'
                                    }}
                                    disabled={statusGenerateBtn}
                                  >
                                    GENERAR CÓDIGO {timeAvailable}
                                  </Button>
                                :
                                  null
                              
                        }
                      </Grid>
                    </div>
                  );
                }}
              </Formik>
            </Grid>
          :
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} style={{textAlign: 'center', paddingTop: '10px'}}>
                  <IconButton aria-label="upload qr" component="span" size="large" onClick={handleLogout}>
                    <LogoutIcon style={{color: 'red'}} />
                  </IconButton>
                </Grid>
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
                  <Grid item xs={12} style={{textAlign:'center', paddingTop:'33px'}}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={()=>{
                        setViewAllQr(true);
                        window.scrollBy(0, 10);
                      }}
                      startIcon={<QrCodeScannerIcon />}
                      className={giftStyle.btnViewQR}
                    >
                      VER QR's
                    </Button>
                  </Grid>
                  {
                    (!viewAllQr)
                      &&
                        (qrBuy?.img)
                          &&
                            <Grid item xs={12} style={{textAlign:'center', marginTop: '18px'}}>
                              <div className={giftStyle.wrapperQr} style={{borderColor:'green'}}>
                                <img src={qrBuy.img} alt="QR code" ref={imagenRef} style={{width: '100%'}}/>
                                <div className='partner'>
                                  {qrBuy.namePartner}
                                </div>
                                <div className='amount'>
                                  S/{qrBuy.amountTicket}
                                </div>
                              </div>
                              <Tooltip title="Descargar" placement="bottom">
                                <IconButton aria-label="upload qr" component="span" size="large" onClick={downloadQr}>
                                  <DownloadingIcon style={{color: '#05204A'}} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                  }
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
                                  (ticket.status) ? 'DISPONIBLE' : 'ESCANEADO'
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
      }      
    </Grid>
  )
}

export default GiftCardCustomer;
