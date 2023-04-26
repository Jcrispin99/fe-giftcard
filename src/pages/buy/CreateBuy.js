import React, { useState, useEffect } from 'react';
import { Button, Grid, Modal } from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { BuyService, GiftCardService } from '../../services';
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

const buyService = new BuyService();
const giftCardService = new GiftCardService();

const CreateBuy = (props) => {

  const { 
    openBuy, 
    setOpenBuy, 
    dataCard, 
    dataUser, 
    giftCards, 
    setGiftCards,
    giftCardBuy
  } = props;
  const { blockUI, dialogUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const baseValues = {
    gifcardId: '',
    product: '',
    amount: '',
  };
  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);

  const validationSchema = Yup.object({
    amount: Yup
      .number()
      .min(1)
      .required('Obligatorio'),
    product: Yup
      .string()
      .required('Obligatorio'),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      buyService.getAccessToken();
      giftCardService.getAccessToken();
      if(Number(giftCardBuy.amountAvailable) > 0){
        if(Number(values.amount) > Number(giftCardBuy.amountAvailable)){
          dialogUI.current.open('', '', dlgSettings, 'No cuenta con saldo suficiente para realizar la compra');
        }else{
          let newAmountAvailable = Number(giftCardBuy.amountAvailable) - Number(values.amount);
          buyService.create({...values, gifcardId: giftCardBuy.id});
          giftCardService.update({...giftCardBuy, amountAvailable: newAmountAvailable}, giftCardBuy.id);
          let newGiftcards = giftCards.map((e)=>{
            if(e.id === giftCardBuy.id){
                return {
                  ...e,
                  amountAvailable: newAmountAvailable
                }
              }else{
                return e;
              }
            })
          setGiftCards(newGiftcards);
          dialogUI.current.open('', '', dlgSettings, 'Compra realizada con éxito');
        }
      }else{
        dialogUI.current.open('', '', dlgSettings, 'No cuenta con saldo suficiente para realizar la compra');
      }
      // if(dataUser.)
      // buyService.create({...values, gifcardId: idGiftCard});

      // let newCode = '';
      // if(values.code === ''){
      //   newCode = uuidv4();
      // }else{
      //   newCode = values.code;
      // }
      // let r1 = await giftCardService.create({
      //   ...values,
      //   userId: dataUser.id,
      //   status: 1,
      //   code: newCode
      // });
      // dialogUI.current.open('', '', dlgSettings, 'Gift card creada correctamente');
      //   if(dataCard.id){
    //     let newValues = {...values};
    //     values.dni =  `${values.dni}`;
    //     (newValues.dni === dataCard.dni) && delete newValues.dni;
    //     (newValues.email === dataCard.email) && delete newValues.email;
    //     await userService.update({
    //         ...newValues,
    //         fullName: `${newValues.firstName} ${newValues.lastName}`,
    //       }, dataCard.id);
    //   }else{
    //     await userService.create(
    //       {
    //         ...values, 
    //         dni: `${values.dni}`,
    //         fullName: `${values.firstName} ${values.lastName}`,
    //         status: 1,
    //         role: 'employee',
    //         categoryId: 3
    //       });
    //   }
    //   const r1 = await userService.listSearch('sort=-id&role=employee&status=3');
    //   setRows(r1.data.data);
      blockUI.current.open(false);
      setOpenBuy(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
    }
  };

  // useEffect(() => {
  //   if(dataCard.id){
  //     setInitialValues(dataCard);
  //   }
  // }, [dataCard]);

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
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
                    <TextField
                      type="text"
                      id="product"
                      name="product"
                      autoComplete="product"
                      value={values.product || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.product && touched.product ? errors.product : ""
                      }
                      error={!!(errors.product && touched.product)}
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
                    onClick={() => { setOpenBuy(false) }}
                  >
                    CANCELAR
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={()=>{handleSubmit()}}
                  >
                    GUARDAR
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
