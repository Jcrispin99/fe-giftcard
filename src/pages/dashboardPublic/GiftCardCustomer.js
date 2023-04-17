import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { AuthService } from '../../services';
import * as Yup from 'yup';
import { Box, Grid, TextField, Button } from '@mui/material';
import { Formik } from 'formik';
import { GiftCardCustomerPublicStyles } from './styles/giftcard-public-style';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
    confirm: '',
  },
  onConfirm: () => {},
};

const authService = new AuthService();

const GiftCardCustomer = () => {

  const modalStyle = ModalCustomStyles();
  const giftStyle = GiftCardCustomerPublicStyles();
  const [card, setCard] = useState({});
  const { blockUI, dialogUI } = useUI();
  const location = useLocation();
  const [giftcardValidate, setGiftcardValidate] = useState(false);
  const [requestFailed, setRequestFailed] = useState('');

  const baseValues = {
    code: ''
  };
  
  const [initialValues, setInitialValues] = useState(baseValues);
  const validationSchema = Yup.object({
    code: Yup
      .string()
      .min(36,'36 dígitos')
      .max(36,'36 dígitos')
      .required('Código obligatorio para generar tickets de consumo')
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed('');
      const { data } = await authService.loguinMyCard(values);
      setGiftcardValidate(true);
      setCard(data.giftcard);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed('Código no válido');
    }
  };

  const handleGenerateCodeTicket = async () => {
    try {
      blockUI.current.open(true);
      const id = location.pathname.split('/gift-card-customer/')[1];
      await authService.mycard({id});
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
                        >
                          GENERAR CÓDIGO
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
      }      
    </Grid>
  )
}

export default GiftCardCustomer;
