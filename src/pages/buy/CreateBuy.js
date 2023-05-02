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
  const modalStyle = ModalCustomStyles();
  const baseValues = {
    amount: '',
    partner: '',
  };
  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const [amountMax, setAmountMax] = useState(100);
  const [partnerAvailable, setPartnersAvailable] = useState([]);

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

      const body = {
        gifcard: giftCardBuy.uid,
        partner: values.partner,
        amount: values.amount
      }

      console.log('body',body);

      // const r1 = await authService.generateQr(body);

      blockUI.current.open(false);
      setOpenBuy(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
    }
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

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
    setAmountMax(giftCardBuy.amountAvailable);
  }, []);

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
                  <Grid item xs={8}>
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
              </div>
            );
          }}
        </Formik>
      </div>
    </Modal>
  )
}

export default CreateBuy;
