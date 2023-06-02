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
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import clsx from 'clsx';
import dateFormat from 'dateformat';
import store from '../../redux/store';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';


const partnerService = new PartnerService();
const userService = new UserService();
const giftcardService = new GiftCardService();


let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
  },
  onConfirm: () => {},
};

const ListTicket = () => {

  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const state = store.getState();
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const [dataExport, setDataExport] = useState([]);

  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    date: dateFormat(new Date(), 'yyyy-mm-dd'),
    partner: '',
    authorizer: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues); 
  const [partnerAvailable, setPartnersAvailable] = useState([]);
  const [authorizerAvailable, setAuthorizerAvailable] = useState([]);
  const [rows, setRows] = useState([]);
  const [amountTotal, setAmountTotal] = useState(0);

 
  const handleApprobePaid = async (id) => {
    try {
      blockUI.current.open(true);
      giftcardService.getAccessToken();
      await giftcardService.approveQR({id});
      const newRows = rows.map((e)=>{
        if(e.id === id){
          return {
            ...e,
            statusPaid: true
          }
        }else{
          return e;
        }
      });
      setRows(newRows);
      dialogUI.current.open('', '', dlgSettings, 'PAGADO');
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  }

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
      field: 'amount', 
      headerName: 'MONTO', 
      flex: 0.4,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>
            {`S/.${params.value}`}
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
            {(params.value) ? 'DISPONIBLE' : 'CANJEADO'}
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
      field: 'dateScann', 
      headerName: 'FECHA DE ESCANEO', 
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            {(params.row.dateScan) ? dateFormat(new Date(params.row.dateScan), "dd-mm-yy HH:MM") : ''}
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
        if (state.user.role === 'ADMIN_ROLE') {
          return (
            <div>
              <IconButton 
                aria-label="delete" 
                color="primary" 
                onClick={()=>{handleApprobePaid(params.id)}}
                disabled={(params.row.statusPaid)}
              >
                <Tooltip title="APROBAR PAGO" placement="top">
                  <ThumbUpIcon />
                </Tooltip>
              </IconButton>
            </div>
          )
        }
        return null;
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
      customizeExport(r1.data.tickets);      
      setRows(r1.data.tickets);
      setAmountTotal(r1.data.totalAmount);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const customizeExport = (tickets) => {
    try {
      const headers = [
        'PARTNER',
        'MONTO',
        'ESTADO DE VERIFICACIÓN',
        'AUTORIZADOR',
        'FECHA DE ESCANEO',
        'ESTADO DE PAGO'
      ];
      const dataExcel = tickets.map((ticket)=>{
        return [
          ticket.partner.name,
          `S/${ticket.amount}`,
          (ticket.status) ? 'DISPONIBLE' : 'CANJEADO',
          (ticket.authorizer?.name) ? ticket.authorizer?.name : '____',
          (ticket.dateScan) ? dateFormat(new Date(ticket.dateScan), "dd-mm-yy HH:MM") : '',
          (ticket.statusPaid) ? 'PAGADO' : 'FALTA PAGAR'
        ]
      });
      dataExcel.unshift(headers);
      setDataExport(dataExcel);
    } catch (error) {
      setDataExport([]);
    }
  }

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch();

      if(state.user.role === "EMPLOYEE_ROLE"){
        const newR1 = r1.data.partners.filter((e) => e.uid === state.user.partner);
        setPartnersAvailable(newR1);
        setInitialValues(prevValues => ({
          ...prevValues,
          partner: newR1[0].uid
        }));
      }else{
        setPartnersAvailable(r1.data.partners);
      }
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const getListAuthorizers = async () => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      let r1 = await userService.listAuthorizers('');

      if(state.user.role === "EMPLOYEE_ROLE"){
        const newR1 = r1.data.users.filter((e) => e.uid === state.user.uid);
        setAuthorizerAvailable(newR1);
        setInitialValues(prevValues => ({
          ...prevValues,
          authorizer: newR1[0].uid
        }));
      }else{
        setAuthorizerAvailable(r1.data.users);
      }

      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');
    worksheet.addRows(dataExport);

    const nameFile = new Date().toLocaleTimeString();
    const password = 'admin_48483845';

    worksheet.protect('', {
      password: password,
      sheet: true,
      objects: true,
      scenarios: true,
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${nameFile}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
    
  };

  useEffect(() => {
    (async function init() {
      await Promise.all([getListAuthorizers(), getListPartner()]);
    })();
  }, []);

  return (
    <div style={(isMobile) ? {marginTop: '100px'} : {marginTop: '40px'}}>
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
                <IconButton
                  component="label"
                  onClick={()=>{handleSubmit()}}
                  style={{backgroundColor: '#00beff2b'}}
                >
                  <Tooltip title='BUSCAR' placement="bottom">
                    <SearchIcon />
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item xs={12} style={{textAlign: 'center', marginTop: '45px'}}>
                <span style={{marginRight: '20px'}}>{ `MONTO TOTAL: S/${amountTotal}` }</span>
              </Grid>
              {
                (rows.length>0)
                  &&
                    <Grid item xs={12} style={{textAlign: 'center', marginTop: '45px'}}>
                      <IconButton
                        component="label"
                        onClick={()=>{exportToExcel()}}
                        style={{backgroundColor: '#57c115', color: 'white'}}
                      >
                        <Tooltip title='DESCARGAR' placement="bottom">
                          <SaveAltIcon />
                        </Tooltip>
                      </IconButton>
                    </Grid>
              }
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
