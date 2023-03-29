import React, { useState, useEffect } from 'react';
import { Button, Grid, Modal } from '@mui/material';
import 'animate.css';
import { Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import _ from 'lodash';
import { UserService } from '../../../services';
import { useUI } from '../../../app/context/ui';
import { ModalCustomStyles } from '../../../assets/css';

const userService = new UserService();

const EmployeeManager = (props) => {

  const { open, setOpen, setRows, rows, dataEmployee } = props;
  const { blockUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const baseValues = {
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    phone: ''
  };
  const [initialValues, setInitialValues] = useState(baseValues);
  const [hasError, setHasError] = useState({});
  const [requestFailed, setRequestFailed] = useState(false);

  const validationSchema = Yup.object({
    dni: Yup
      .string()
      .min(8,'8 dígitos')
      .max(8,'8 dígitos')
      .required('Obligatorio'),
    firstName: Yup
      .string()
      .required('Obligatorio'),
    lastName: Yup
      .string()
      .required('Obligatorio'),
    email: Yup
      .string()
      .email('Ingrese un correo válido')
      .required('Obligatorio'),
    birthdate: Yup
      .date()
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
        let newValues = {...values};
        values.dni =  `${values.dni}`;
        (newValues.dni === dataEmployee.dni) && delete newValues.dni;
        (newValues.email === dataEmployee.email) && delete newValues.email;
        await userService.update({
            ...newValues,
            fullName: `${newValues.firstName} ${newValues.lastName}`,
          }, dataEmployee.id);
      }else{
        await userService.create(
          {
            ...values, 
            dni: `${values.dni}`,
            fullName: `${values.firstName} ${values.lastName}`,
            status: 1,
            role: 'employee',
            categoryId: 3
          });
      }
      const r1 = await userService.listSearch('sort=-id&role=employee&status=3');
      setRows(r1.data.data);
      blockUI.current.open(false);
      setOpen(false);
    } catch (e) {
      blockUI.current.open(false);
      setRequestFailed(true);
      if(dataEmployee.id){
        setInitialValues(dataEmployee);
      }
      if (!e.response.data.errors) {
        setHasError({ message: e.response.data.message });
      }
      if (!_.isUndefined(e.response.data.errors.email)) {
        setHasError({ message: 'Ingrese otro correo' });
      }
      if (!_.isUndefined(e.response.data.errors.dni)) {
        setHasError({ message: 'Ingrese otro DNI' });
      }
      if (!_.isUndefined(e.response.data.errors.categoryId)) {
        setHasError({ message: 'Ingrese una categoría' });
      }
    }
  };

  useEffect(() => {
    if(dataEmployee.id){
      setInitialValues(dataEmployee);
    }
  }, [dataEmployee]);

  useEffect(() => {
    setRequestFailed(false);
    setHasError({message: ''});
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
                      id="firstName"
                      name="firstName"
                      autoComplete="firstName"
                      value={values.firstName || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.firstName && touched.firstName ? errors.firstName : ""
                      }
                      error={!!(errors.firstName && touched.firstName)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={4} className={modalStyle.grdItem}>
                    <label>APELLIDOS</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      id="lastName"
                      name="lastName"
                      autoComplete="lastName"
                      value={values.lastName || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      size='small'
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helperText={
                        errors.lastName && touched.lastName ? errors.lastName : ""
                      }
                      error={!!(errors.lastName && touched.lastName)}
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
