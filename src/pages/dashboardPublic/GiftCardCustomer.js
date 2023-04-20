import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { AuthService, PartnerService } from '../../services';
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

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
    confirm: '',
  },
  onConfirm: () => {},
};

const authService = new AuthService();
const partnerService = new PartnerService();

const GiftCardCustomer = () => {

  const imagenRef = useRef(null);
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

  //qr generado
  const [viewAllQr, setViewAllQr] = useState(false);
  const [tickets, setTickets] = useState([]);
  //

  const baseValues = {
    code: ''
  };

  const baseValuesTicket = {
    amount: ''
  }
  
  const [initialValues, setInitialValues] = useState(baseValues);
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
      const { data } = await authService.loguinMyCard(values);
      setGiftcardValidate(true);
      setCard(data.giftcard);
      setTickets(data.tickets);
      setAmountMax(data.giftcard.amountAvailable)
      await getListPartner();
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed('Código no válido');
    }
  };

  const onSubmitTicket = async (values) => {
    try {
      setQrBuy({});
      blockUI.current.open(true);
      const body = {
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

      // const newTicket = {
      //   amount: values.amount,
      //   qrImage: r1.data.url,
      //   partner: {
      //     name: partnerSelected.name
      //   }
      // };

      // let newTicketsAvailable = tickets;
      // newTicketsAvailable.push(newTicket);
      // console.log('newTicketsAvailable',newTicketsAvailable);
      // setTickets([newTicketsAvailable]);

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
      const id = location.pathname.split('/gift-card-customer/')[1];
      await authService.mycard({id});
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
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        onConfirm: () => {},
      };
      dialogUI.current.open(
        'NO PERMITIDO',
        'Comuníquese con el proveedor',
        dlgSettings
      );
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

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('');
      setPartnersAvailable(r1.data.partners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const downloadQr = () => {
    const img = imagenRef.current;
    const urlImagen = img.src;
    const linkTemp = document.createElement('a');
    linkTemp.href = urlImagen;
    linkTemp.setAttribute('download', 'qr');
    linkTemp.click();
  };

  useEffect(() => {
    let statusGenerateBtn = localStorage.getItem('statusGenerateBtn');
    const timeLeft = Number(localStorage.getItem('timeLeft'));

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
                    <div>
                      <Grid container spacing={3} className='wrapperForm'>
                        <Grid item xs={4} className={modalStyle.grdItem}>
                          <label>CÓDIGO</label>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            type="text"
                            id="code"
                            code="code"
                            autoComplete="code"
                            value={values.code || ''}
                            className={modalStyle.texfield}
                            placeholder="Escriba aqui ..."
                            size='small'
                            margin="normal"
                            required
                            fullWidth
                            variant="outlined"
                            helperText={
                              errors.code && touched.code ? errors.code : ""
                            }
                            error={!!(errors.code && touched.code)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                      <Box pb={5}/>
                      <Grid container justifyContent="center">
                        <Button
                          variant="contained"
                          size="large"
                          className={modalStyle.button}
                          onClick={handleGenerateCodeTicket}
                          style={{
                            marginRight: '24px',
                            backgroundColor: '#808080ba'
                          }}
                          disabled={statusGenerateBtn}
                        >
                          GENERAR CÓDIGO {timeAvailable}
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={()=>{handleSubmit()}}
                          className={giftStyle.btnGenerateQr}
                        >
                          INGRESAR
                        </Button>
                      </Grid>
                    </div>
                  );
                }}
              </Formik>
            </Grid>
          :
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} style={{textAlign:'center'}}>
                  BIENVENIDO/A {card.user?.name} !
                </Grid>
                <Grid item xs={12}>
                  <div className={modalStyle.wrapperCustomerGiftCard}>
                    <div className={modalStyle.wrapperViewGiftcard}>
                      <article className="gift-card animate__animated animate__rotateInDownLeft">
                        <div className="gift-card__image">
                        </div>
                        <section className="gift-card__content">
                          <div className="gift-card__amount">S/.{card.amount}</div>
                          <div className="gift-card__amount-remaining">S/{card.amountAvailable} Disponible</div>    
                          <div className="gift-card__code">{card.code}</div>
                          <div className="gift-card__msg">Identification code</div>
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
                      initialValues={baseValuesTicket}
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
                  <Grid item xs={12} style={{textAlign:'center', paddingTop:'20px'}}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={()=>{setViewAllQr(true)}}
                      startIcon={<QrCodeScannerIcon />}
                      className={giftStyle.btnViewQR}
                    >
                      QR's GENERADOS
                    </Button>
                  </Grid>
                  {
                    (qrBuy)
                      &&
                        <Grid item xs={12} style={{textAlign:'center', marginTop: '43px'}}>
                          <div className={giftStyle.wrapperQr}>
                            <img src={qrBuy.img} alt="QR code" ref={imagenRef} style={{width: '100%'}}/>
                            <div>
                              {qrBuy.namePartner}
                            </div>
                            <div>
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
                          <Grid key={`ticket${index}`} item xs={6} style={{textAlign:'center', marginTop: '43px'}}>
                            <div className={giftStyle.wrapperQr}>
                              <img src={ticket.qrImage} alt="QR code" style={{width: '100%'}}/>
                              <div>
                                {ticket.partner?.name}
                              </div>
                              <div>
                                S/{ticket.amount}
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
