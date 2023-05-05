import React, { useState, useEffect } from 'react'
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { Formik } from 'formik';
import { useUI } from '../../app/context/ui';
import { ListStyles, ModalCustomStyles } from '../../assets/css';
import SearchIcon from '@mui/icons-material/Search';
import * as Yup from 'yup';
import { GiftCardService, PartnerService, UserService } from '../../services';
import { EmployeeStyles } from '../employee/components/employees-style';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import dateFormat from 'dateformat';

const partnerService = new PartnerService();
const userService = new UserService();
const giftcardService = new GiftCardService();

const ListTicket = () => {

  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();


  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    date: '',
    partner: '',
    authorizer: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues); 
  const [partnerAvailable, setPartnersAvailable] = useState([]);
  const [authorizerAvailable, setAuthorizerAvailable] = useState([]);
  const [rows, setRows] = useState([]);
 
  const [buys, setBuys] = useState([]);  

  const columns = [
    { 
      field: '_id', 
      headerName: 'PARTNER', 
      flex: 0.4,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.partner.name}
          </div>
        )
      }
    },
    { 
      field: 'status', 
      headerName: 'ESTADO VERIFICACIÓN', 
      width: 250,
      renderCell: (params) => {
        return (
          <div className={params.value ? listStyle.containerNotPay : listStyle.containerPay}>
            {(params.value) ? 'DISPONIBLE' : 'ESCANEADO'}
          </div>
        )
      }
    },
    { 
      field: 'qrImage', 
      headerName: 'AUTORIZADOR', 
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            {(params.row.authorizer) ? params.row.authorizer.name : '____'}
          </div>
        )
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'FECHA CREACIÓN', 
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            {dateFormat(new Date(params.value), "dd-mm-yy HH:MM")}
          </div>
        )
      }
    },
    { 
      field: 'statusPaid', 
      headerName: 'ESTADO DE PAGO', 
      width: 250,
      renderCell: (params) => {
        return (
          <div className={params.value ? listStyle.containerPay : listStyle.containerNotPay}>
            {(params.value) ? 'PAGADO' : 'FALTA PAGAR'}
          </div>
        )
      }
    },
    { 
      field: 'createdAtD', 
      headerName: 'ACCIONES', 
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="APROBAR PAGO" placement="top">
              <IconButton aria-label="delete" color="primary" onClick={()=>{}}>
                <ThumbUpIcon />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    }
  ];

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      const queryString = Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      giftcardService.getAccessToken();
      const r1 = await giftcardService.getTickets(queryString);
      setRows(r1.data.tickets);
      // const {data:buys} = await buyService.listSearch(`created_at=${values.date}`);
      // setBuys(buys.data);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
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

  const getListAuthorizers = async () => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      const r1 = await userService.listAuthorizers('');
      setAuthorizerAvailable(r1.data.users);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getListPartner();
      await getListAuthorizers();
    })();
  }, []);

  return (
    <div style={{marginTop: '40px'}}>
          <Formik
            initialValues={initialValues}
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
                <Grid container>
                  <Grid item xs={4}>
                    <FormControl style={{width: '100%', paddingRight: '7px'}}>
                      <InputLabel id="partnerLabel">Partner</InputLabel>
                      <Select
                        labelId="partnerLabel"
                        id="partner"
                        label="Socio"
                        name="partner"
                        onChange={handleChange}
                        value={values.partner}
                        fullWidth
                      >
                        <MenuItem value={''} key={`partner${0}`}>LIMPIAR</MenuItem>
                        {
                          partnerAvailable.map((partner, index)=>(
                            <MenuItem value={partner.uid} key={`partner${index}`}>{partner.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="date"
                      id="date"
                      name="date"
                      autoComplete="date"
                      value={values.date || ''}
                      className={modalStyle.texfield}
                      placeholder="Escriba aqui ..."
                      margin="normal"
                      required
                      fullWidth
                      variant="outlined"
                      helpertext={
                        errors.date && touched.date ? errors.date : ""
                      }
                      error={!!(errors.date && touched.date)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{paddingRight: '7px'}}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl style={{width: '100%', paddingRight: '7px'}}>
                      <InputLabel id="authorizerLabel">Autorizador</InputLabel>
                      <Select
                        labelId="authorizerLabel"
                        id="authorizer"
                        label="Autorizador"
                        name="authorizer"
                        value={values.authorizer}
                        onChange={handleChange}
                        fullWidth
                      >
                         <MenuItem value={''} key={`authorizer${0}`}>LIMPIAR</MenuItem>
                        {
                          authorizerAvailable.map((authorizer, index)=>(
                            <MenuItem value={authorizer.uid} key={`authorizer${index}`}>{authorizer.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} style={{textAlign: 'center', paddingTop: '17px'}}>
                    <Tooltip title='BUSCAR' placement="bottom">
                      <IconButton
                        component="label"
                        onClick={()=>{handleSubmit()}}
                        style={{backgroundColor: '#00beff2b'}}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              );
            }}
          </Formik>
        
      <Grid container style={{ height: 540, width: '100%', marginTop: '50px' }}>
          <DataGrid
            className={clsx(listStyle.dataGrid, classes.root)} 
            rows={rows}
            columns={columns}
            pageSize={20}
            pageSizeOptions={[20,50,100]}
          />
      </Grid>
    </div>
  )
}

export default ListTicket;
