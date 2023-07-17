import React, { useState, useEffect } from 'react';
import { Button, FormHelperText, Grid, MenuItem, Modal, Select } from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { GiftCardService, PartnerService } from '../../services';
import { useUI } from '../../app/context/ui';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { GiftCardCustomerPublicStyles } from '../dashboardPublic/styles/giftcard-public-style';
import store from '../../redux/store';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'Cerrar',
  },
  onConfirm: () => {},
};

const partnerService = new PartnerService();
const giftCardService = new GiftCardService();

const CreateBuy = (props) => {

  const { 
    openBuy, 
    setOpenBuy, 
    giftCardBuy
  } = props;
  const { blockUI, dialogUI } = useUI();
  const state = store.getState();
  const modalStyle = ModalCustomStyles();
  const giftStyle = GiftCardCustomerPublicStyles();
  const partner = state.user?.partner;

  const baseValues = {
    amount: '',
    partner: (partner) ? partner._id : '',
  };
  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const [amountMax, setAmountMax] = useState(100);
  const [partnerAvailable, setPartnersAvailable] = useState([]);
  const [qrBuy, setQrBuy] = useState({});

  const validationSchema = Yup.object({
    amount: Yup
      .number()
      .min(1, 'Debe ser al menos S/1')
      .max(amountMax, `No debe superar los S/${amountMax}`)
      .required('Obligatorio'),
    partner: Yup
      .string()
      .required('Obligatorio'),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      giftCardService.getAccessToken();

      const res = await giftCardService.createTicketEmployee({
        gifcard: giftCardBuy.uid,
        partner: values.partner,
        amount: values.amount
      });

      blockUI.current.open(false);

      setQrBuy({
        img: res.data.img,
        namePartner: res.data.namePartner,
        amountTicket: res.data.amountTicket,
        status: res.data.status
      });

    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      setHasError({message: e.response.data.message});
    }
  };

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('status=1,2');
      let newr1 = [];
      if(state.user.role === 'ADMIN_ROLE'){
        newr1 = r1.data.partners.filter((e)=>(e.name === 'KDOSH' ||e.name === 'OLYMPO'));
      }else{
        newr1 = r1.data.partners.filter((partner)=>partner.uid === state.user.partner._id);
      }

      setPartnersAvailable(newr1);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
    setAmountMax(giftCardBuy.amountAvailable);
    setQrBuy({});
  }, [giftCardBuy.uid]);

  useEffect(() => {
    (async function init() {
      await getListPartner();
    })();
  }, []);

  return (
    <Modal
      open={openBuy}
      onClose={() => setOpenBuy(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEscapeKeyDown={true}
      className="animate__animated animate__backInLeft"
    >
      <div className={modalStyle.paperModal}>
        <Typography className="title">CREAR COMPRA</Typography>
        <Typography component="div">
          {requestFailed && (
            <p className={modalStyle.formError} align="center">{hasError.message}</p>
          )}
        </Typography>
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
                    <label>MONTO</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="number"
                      id="amount"
                      name="amount"
                      autoComplete="amount"
                      value={values.amount || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
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
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>PARTNER</label>
                  </Grid>
                  <Grid item xs={8} style={{textAlign: 'center'}}>
                    <Select
                      displayEmpty
                      id="partner"
                      name="partner"
                      value={values.partner}
                      onChange={handleChange}
                      size='small'
                      error={touched.partner && Boolean(errors.partner)}
                      helpertext={
                        errors.partner && touched.partner ? errors.partner : ""
                      }
                      fullWidth
                    >
                      {
                        partnerAvailable.map((e, index)=>(
                          <MenuItem key={`partner${index}`} value={e.uid}>{e.name}</MenuItem>
                        ))
                      }
                    </Select>
                    <FormHelperText 
                      className={modalStyle.formError} 
                      style={{textAlign: 'center', color: '#df686a'}}>
                        {errors.partner}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <Box pb={5}/>
                <Grid container justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    className={modalStyle.button}
                    onClick={() => { setOpenBuy(false) }}
                    style={{backgroundColor:'red', color:'white'}}
                  >
                    CERRAR
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={()=>{handleSubmit()}}
                    style={{marginLeft:'20px'}}
                  >
                    CREAR
                  </Button>
                </Grid>
                <Grid container justifyContent={"center"}>
                  {
                    (qrBuy.img)
                      &&
                        <div className={giftStyle.wrapperQr} style={{borderColor:'gray', textAlign: 'center'}}>
                          <img src={qrBuy.img} alt="QR code" style={{width: '100%'}}/>
                          <div className='partner'>
                            {qrBuy.namePartner}
                          </div>
                          <div className='amount'>
                            S/{qrBuy.amountTicket}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            backgroundColor: '#7a7a7a',
                            color: 'white',
                            marginTop: '7px',
                            padding: '2px',
                          }}>
                            {
                              (qrBuy.status) ? 'DISPONIBLE' : 'CANJEADO'
                            }
                          </div>
                        </div>
                  }
                </Grid>
              </div>
            );
          }}
        </Formik>
      </div>
    </Modal>
  )
}

export default CreateBuy;
