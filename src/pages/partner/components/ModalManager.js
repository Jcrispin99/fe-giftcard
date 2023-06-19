import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormHelperText, Grid, MenuItem, Modal, Select } from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { PartnerService } from '../../../services';
import { useUI } from '../../../app/context/ui';
import { ModalCustomStyles } from '../../../assets/css';

const partnerService = new PartnerService();

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
  },
  onConfirm: () => {},
};

const ModalManager = (props) => {

  const { open, setOpen, rows, setRows, data } = props;

  const { blockUI, dialogUI } = useUI();
  const modalStyle = ModalCustomStyles();

  const baseValues = {
    name: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);

  const validationSchema = Yup.object({
    name: Yup
      .string()
      .required('Obligatorio')
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      partnerService.getAccessToken();
      let newRows = [];
      if(data.id){
        let {data: partnerUpdate} = await partnerService.update({
          ...values,
        }, data.id);
        newRows = rows.map((e)=>{
          if(e.id == partnerUpdate.uid){
            return {...partnerUpdate, id: partnerUpdate.uid};
          }else{
            return e;
          }
        });
      }else{
        let { data: newPartner } = await partnerService.create(values);
        if(newPartner.type === 'new'){
          newRows = [...rows, {
            id: newPartner.partner.uid,
            ...newPartner.partner
          }]
        }
        if(newPartner.type === 'restored'){
          dialogUI.current.open('', '', dlgSettings, 'Restaurado ');
          newRows = [...rows, {
            id: newPartner.partner.uid,
            ...newPartner.partner
          }]
        }
      }

      setRows(newRows);
      blockUI.current.open(false);
      setOpen(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      
      if(data.id){
        setInitialValues(data);
      }

      if (!_.isUndefined(e.response.data)) {
        let type = e.response.data.type;
        switch (type) {
          case "repeated": setHasError({ message: 'La empresa que ingresó ya existe' }); break;
          case "in_trash_can": setHasError({ message: 'La empresa que ingresó está en papelera' }); break;
          default: setHasError({ message: e.response.data.msg }); break;
        }
      }
      
    }
  };

  useEffect(() => {
    if(data.id){
      setRequestFailed(false);
      setInitialValues({...data});
    }else{
      setInitialValues(baseValues);
      setRequestFailed(false);
    }
  }, [data]);

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableEscapeKeyDown={true}
        className="animate__animated animate__backInLeft"
      >
        <div className={modalStyle.paperModal}>
          <Typography className="title">{(!data.id) ? 'CREAR EMPRESA' : 'EDITAR EMPRESA'}</Typography>
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
                      <label>NOMBRE</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={values.name || ''}
                        className={modalStyle.texfield}
                        placeholder="Escriba aqui ..."
                        size='small'
                        margin="normal"
                        required
                        fullWidth
                        variant="outlined"
                        helperText={
                          errors.name && touched.name ? errors.name : ""
                        }
                        error={!!(errors.name && touched.name)}
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
    </>
  )
}

export default ModalManager;
