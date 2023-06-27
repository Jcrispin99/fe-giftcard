import React, { useState, useEffect, useRef } from 'react';
import { 
  Avatar,
  Button, 
  Checkbox,
  FormControlLabel, 
  Grid, 
  IconButton,
  MenuItem, 
  Modal, 
  Select, 
  Tooltip
} from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { 
  GiftCardService, 
  PartnerService 
} from '../../services';
import { useUI } from '../../app/context/ui';
import { CustomerStyles } from '../customer/components/customer-style';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RefreshIcon from '@mui/icons-material/Refresh';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'Cerrar',
  },
  onConfirm: () => {},
};

const giftCardService = new GiftCardService();
const partnerService = new PartnerService();


const CreateGiftcard = (props) => {

  const { 
    open, 
    setOpen,
    dataUser,
    dataCard
  } = props;

  const { blockUI, dialogUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const customerStyle = CustomerStyles();

  const [requestFailedGiftcard, setRequestFailedGiftcard] = useState(false);
  const [hasErrorGiftcard, setHasErrorGiftcard] = useState({});
  const [partnersAvailable, setPartnersAvailable] = useState([]);
  const [checked, setChecked] = useState([]);
  const [codeScaned, setCodeScaned] = useState('');
  const formikRef = useRef();


  const initialValuesGiftcard = {
    giftphone: '',
    amount: '',
    code: '',
    type: '',
    permissions: []
  };

  const [initialValues, setInitialValues] = useState(initialValuesGiftcard);

  const validationSchemaGiftcard = Yup.object({
    amount: Yup
      .number()
      .required('Obligatorio'),
    code: Yup
      .string()
      .required('Obligatorio'),
    type: Yup
      .string()
      .required('Obligatorio')
  });

  const onSubmitGiftcard = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailedGiftcard(false);
      giftCardService.getAccessToken();
      let permissions = [];
      checked.map((e)=>{
        if(e.status){
          permissions.push(e.id);
        }
      });

      if(values.code === ''){
        delete values.code;
      }

      if(dataCard.uid){

        if(dataCard.amount !== values.amount){
          const mytickets = await giftCardService.mytickets(`giftcard=${dataCard.uid}`);
          if(mytickets.data.total > 0){
            dialogUI.current.open('ERROR', '', dlgSettings, 'La giftcard está siendo utilizada');
          }else{
            await giftCardService.update({
              ...values,
              amountAvailable: values.amount,
              user: dataUser.uid,
              permissions
            }, dataCard.uid);
            dialogUI.current.open('', '', dlgSettings, 'Gifcard actualizada');
          }
        }else{
          await giftCardService.update({
            ...values,
            user: dataUser.uid,
            permissions
          }, dataCard.uid);
          dialogUI.current.open('', '', dlgSettings, 'Gifcard actualizada');
        }
      }else{
        await giftCardService.create({
          ...values,
          user: dataUser.uid,
          permissions
        });
        dialogUI.current.open('', '', dlgSettings, 'Gifcard creada');
      }
      blockUI.current.open(false);
      setOpen(false)
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailedGiftcard(true);
      if (!_.isUndefined(e.response.data)) {
        setHasErrorGiftcard({ message: e.response.data.message });
      }
    }
  };

  const handleChangePartner = (event) => {
    const value = event.target.value;
    const status = event.target.checked;
    let newChecked = checked.map((e)=>{
      if(e.id === value){
        return { ...e, status};
      }else{
        return e;
      }
    });
    setChecked(newChecked);
  };

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('status=1,2');
      setPartnersAvailable(r1.data.partners);
      const checkedPartners = r1.data.partners.map((e)=>({id: e.uid, status: true}));
      setChecked(checkedPartners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleSelectAllPartner = () => {
    try {
      blockUI.current.open(true);
      const checkedPartners = partnersAvailable.map((e)=>({id: e.uid, status: true}));
      setChecked(checkedPartners);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  useEffect(() => {
    (async function init() {
      await getListPartner();
    })();
  }, []);

  useEffect(() => {
    setRequestFailedGiftcard(false);
    if(dataCard.uid){
      setInitialValues({...dataCard});
      const newCheckedPartners = partnersAvailable.map((e)=>{
        if(dataCard.permissions.includes(e.uid)){
          return {id: e.uid, status: true}
        }else{
          return {id: e.uid, status: false}
        }
      });
      setChecked(newCheckedPartners);
    }else{
      setInitialValues(initialValuesGiftcard);
    }
  }, [dataCard]);

  const setFieldValueFromExternalFunction = (codeScaned) => {
    if (formikRef && formikRef.current && formikRef.current.setFieldValue) {
      formikRef.current.setFieldValue("code", codeScaned);
    }
  };

  const handleClearCode = () => {
    setCodeScaned('');
    formikRef.current.setFieldValue("code", '');
  }

  useEffect(() => {
    if(codeScaned.length===10){
      setFieldValueFromExternalFunction(codeScaned);
    }
  }, [codeScaned]);

  useEffect(() => {
    setCodeScaned('');
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEscapeKeyDown={true}
      className="animate__animated animate__backInLeft"
    >
      <div className={modalStyle.paperModal}>
        <Typography className="title">{ (dataCard.uid) ? 'EDITAR' : 'CREAR' } GIFT CARD</Typography>
        <Typography component="div">
          {requestFailedGiftcard && (
            <p className={modalStyle.formError} align="center">{hasErrorGiftcard.message}</p>
          )}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemaGiftcard}
          onSubmit={onSubmitGiftcard}
          enableReinitialize={true}
          innerRef={formikRef}
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
                  <Grid item xs={12} style={{textAlign: 'center'}}>
                    <Tooltip title="LIMPIAR CAMPO" placement="top">
                      <IconButton
                        color="primary" 
                        component="label"
                        onClick={handleClearCode}
                        size="large"
                      >
                        <RefreshIcon/>
                      </IconButton>
                    </Tooltip>
                  </Grid>
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
                    <label>CÓDIGO</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      id="code"
                      name="code"
                      autoFocus={(open) ? true : false}
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
                      disabled={(dataCard.uid) ? true : false}
                      error={!!(errors.code && touched.code)}
                      onInput={(event)=>{
                        if(event.target.value/10 < 1){
                          setCodeScaned(`${codeScaned}${event.target.value}`);
                        }
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>CELULAR</label>
                    <div className='optional'>(Nuevo receptor)</div>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="number"
                      id="giftphone"
                      name="giftphone"
                      autoComplete="giftphone"
                      value={values.giftphone || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.giftphone && touched.giftphone ? errors.giftphone : ""
                      }
                      error={!!(errors.giftphone && touched.giftphone)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>M. PAGO</label>
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      labelId="type"
                      id="type"
                      name="type"
                      value={values.type}
                      label="Tipo"
                      onChange={handleChange}
                      fullWidth
                      helpertext={
                        errors.type && touched.type ? errors.type : ""
                      }
                      error={!!(errors.type && touched.type)}
                      style={{height: '44px', textAlign: 'center'}}
                    >
                      <MenuItem value={'EFECTIVO'}>EFECTIVO</MenuItem>
                      <MenuItem value={'TARJETA'} >TARJETA</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={7} className={customerStyle.titlePartner}>
                    PARTNERS
                  </Grid>
                  <Grid item xs={5}>
                    <Tooltip title="SELECCIONAR TODO" placement="top">
                      <IconButton
                        color="primary" 
                        component="label"
                        onClick={handleSelectAllPartner}
                        size="large"
                      >
                        <DoneAllIcon/>
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} className={customerStyle.wrapperPartner}>
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
                          <FormControlLabel
                            className={customerStyle.wrapperCheckbox}
                            control={
                              <Checkbox
                                checked={checked.filter((e)=>e.id === partner.uid)[0].status}
                                onChange={handleChangePartner}
                                value={partner.uid}
                              />
                            }
                            label={partner.name}
                          />
                        </Grid>
                      </Grid>
                    ))
                  }
                  </Grid>

                </Grid>
                <Box pb={5}/>
                <Grid container justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    className={modalStyle.button}
                    onClick={() => { setOpen(false) }}
                    style={{
                      marginRight: '24px',
                      backgroundColor: '#808080ba'
                    }}
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

export default CreateGiftcard;
