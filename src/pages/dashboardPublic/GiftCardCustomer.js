import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { AuthService, PartnerService } from '../../services';
import * as Yup from 'yup';
import { Box, Grid, TextField, Button, Avatar } from '@mui/material';
import { Formik } from 'formik';
import { GiftCardCustomerPublicStyles } from './styles/giftcard-public-style';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

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


  const baseValues = {
    code: ''
  };
  
  const [initialValues, setInitialValues] = useState(baseValues);
  const validationSchema = Yup.object({
    code: Yup
      .string()
      .min(6,'6 dígitos')
      .max(6,'6 dígitos')
      .required('Código obligatorio para generar tickets de consumo')
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed('');
      const { data } = await authService.loguinMyCard(values);
      setGiftcardValidate(true);
      setCard(data.giftcard);
      await getListPartner();
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed('Código no válido');
    }
  };

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
  }

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
  }

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
  }

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
                          color="primary"
                          onClick={()=>{handleSubmit()}}
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
                  BIENVENIDO/A {card.user.name} !
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
                GENERAR QR DE CONSUMO
              </Grid>
              <Grid item xs={12} style={{textAlign: 'center', marginTop: '32px', paddingLeft: '36px'}}>
                <Grid container>
                  <Grid item xs={12}>
                    {
                      partnersAvailable.map((partner, index)=>(
                        <Grid key={`partner${index}`} container>
                          <Grid item xs={5}>
                            <Avatar
                              alt={partner.name}
                              src={partner.logo}
                              sx={{ width: 56, height: 56 }}
                            />
                          </Grid>
                          <Grid item xs={7}>
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              onClick={()=>{}}
                              startIcon={<QrCodeScannerIcon />}
                            >
                              CLIC AQUÍ 
                            </Button>
                          </Grid>
                        </Grid>
                      ))
                    }
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{textAlign:'center', paddingTop:'20px'}}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={()=>{}}
                  startIcon={<QrCodeScannerIcon />}
                  style={{backgroundColor:'#82C9ED', color: 'black'}}
                >
                  QR's GENERADOS
                </Button>
              </Grid>
            </Grid>
      }      
    </Grid>
  )
}

export default GiftCardCustomer;
