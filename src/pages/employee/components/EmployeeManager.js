import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormHelperText, Grid, MenuItem, Modal, Select } from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { UserService, PartnerService } from '../../../services';
import { useUI } from '../../../app/context/ui';
import { ModalCustomStyles } from '../../../assets/css';

const userService = new UserService();
const partnerService = new PartnerService();

const EmployeeManager = (props) => {

  const { open, setOpen, setRows, rows, dataEmployee } = props;
  const { blockUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const baseValues = {
    partner: '',
    dni: '',
    name: '',
    email: '',
    password: '',
    birthdate: '',
    phone: ''
  };
  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);
  const [partnersAvailable, setPartnersAvailable] = useState([]);

  const validationSchema = Yup.object({
    partner: Yup
      .string()
      .required('Obligatorio'),
    dni: Yup
      .string()
      .matches(/^[0-9]+$/, 'Debe contener solo números')
      .min(8,'8 dígitos')
      .max(8,'8 dígitos')
      .required('Obligatorio'),
    name: Yup
      .string()
      .required('Obligatorio'),
    email: Yup
      .string()
      .email('Ingrese un correo válido')
      .required('Obligatorio'),
    phone: Yup
      .string()
      .required('Obligatorio'),
    ...(!dataEmployee.id && {
      password: Yup
        .string()
        .min(8,'Mínimo 8 caracteres')
        .required('Obligatorio')
    }),
  });

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setRequestFailed(false);
      userService.getAccessToken();

      if(dataEmployee.id){
        await userService.update({
            ...values,
          }, dataEmployee.id);
      }else{
        await userService.create(
          {
            ...values, 
            status: 1,
            role: 'EMPLOYEE_ROLE'
          });
      }
      const r1 = await userService.listSearch();
      const newData = r1.data.users.map((e)=>({...e, id: e.uid}));
      setRows(newData);
      blockUI.current.open(false);
      setOpen(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      if(dataEmployee.id){
        setInitialValues(dataEmployee);
      }
      if (e.response.data.error.keyPattern?.dni) {
        setHasError({ message: 'El DNI ingresado ya está registrado' });
      }
      if (e.response.data.error.keyPattern?.email) {
        setHasError({ message: 'El correo ingresado ya está registrado' });
      }
    }
  };

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('');
      const newPartner = r1.data.partners.filter((e)=>(e.name === 'Kdosh' || e.name === 'Olympo'));
      setPartnersAvailable(newPartner);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    if(dataEmployee.id){
      const birthdate = new Date(dataEmployee.birthdate).toISOString().split("T")[0];
      setInitialValues({...dataEmployee, birthdate});
    }
  }, [dataEmployee]);

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
  }, []);

  useEffect(() => {
    (async function init() {
      await getListPartner();
    })();
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
        <Typography className="title">{(!dataEmployee.id) ? 'CREAR CUENTA DE EMPLEADO' : 'EDITAR CUENTA DE EMPLEADO'}</Typography>
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
                    <label>TIENDA</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth className={modalStyle.inputCustom}>
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
                      >
                        <MenuItem value="">Selecciona una opción</MenuItem>
                        {
                          partnersAvailable.map((e, index)=>(
                            <MenuItem key={`partner${index}`} value={e.uid}>{e.name}</MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText style={{color: 'red'}} className={modalStyle.formError}>{errors.partner}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>DNI</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      id="dni"
                      name="dni"
                      autoComplete="dni"
                      value={values.dni || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.dni && touched.dni ? errors.dni : ""
                      }
                      error={!!(errors.dni && touched.dni)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>NOMBRE(S)</label>
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
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>F.NAC</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      autoComplete="birthdate"
                      value={values.birthdate || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.birthdate && touched.birthdate ? errors.birthdate : ""
                      }
                      error={!!(errors.birthdate && touched.birthdate)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>CELULAR</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      id="phone"
                      name="phone"
                      autoComplete="phone"
                      value={values.phone || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.phone && touched.phone ? errors.phone : ""
                      }
                      error={!!(errors.phone && touched.phone)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>CORREO</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={values.email || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.email && touched.email ? errors.email : ""
                      }
                      error={!!(errors.email && touched.email)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>CONTRASEÑA</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      id="password"
                      name="password"
                      autoComplete="password"
                      value={values.password || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.password && touched.password ? errors.password : ""
                      }
                      error={!!(errors.password && touched.password)}
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
  )
}

export default EmployeeManager;
