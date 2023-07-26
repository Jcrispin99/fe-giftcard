import React, { useState, useEffect } from 'react'
import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { Formik } from 'formik';
import { useUI } from '../../app/context/ui';
import { ListStyles, ModalCustomStyles } from '../../assets/css';
import SearchIcon from '@mui/icons-material/Search';
import { GiftCardService, PartnerService, UserService } from '../../services';
import { EmployeeStyles } from '../employee/components/employees-style';
import { DataGrid } from '@mui/x-data-grid';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import clsx from 'clsx';
import dateFormat from 'dateformat';
import store from '../../redux/store';
import ExcelJS from 'exceljs';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

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

const ListTicket = (props) => {

  const { type, idPartnerDetail } = props;
  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const state = store.getState();
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const [page, setPage] = useState(0);
  const { blockUI, dialogUI } = useUI();
  const partner = state.user?.partner;

  const baseValues = {
    startDate: dateFormat(new Date(), 'yyyy-mm-dd'),
    endDate: dateFormat(new Date(), 'yyyy-mm-dd'),
    partner: (partner) ? partner._id : (type) ? idPartnerDetail  : '',
    authorizer: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues); 
  const [partnerAvailable, setPartnersAvailable] = useState([]);
  const [authorizerAvailable, setAuthorizerAvailable] = useState([]);
  const [rows, setRows] = useState([]);
  const [amountTotal, setAmountTotal] = useState(0);

  const columns = [
    { 
      field: 'statusTemp', 
      headerName: '_', 
      width: 60,
      renderCell: (params) => {
        if (state.user.role === 'ADMIN_ROLE') {
          return (
            <div>
              <IconButton 
                aria-label="delete" 
                color="primary"
                disabled={ type ? params.row.statusPaid : params.row.statusCheck}
              >
                {
                  (params.row.statusTemp)
                    ? <CheckBoxIcon />
                    : <CheckBoxOutlineBlankIcon />
                }
              </IconButton>
            </div>
          )
        }
        return null;
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
      field: (type) ? 'statusPaid' : 'statusCheck', 
      headerName: (type) ? 'ESTADO DE PAGO' : 'ESTADO DE CUADRE', 
      width: 250,
      renderCell: (params) => {
        return (
          <div className={params.value ? listStyle.containerPay : listStyle.containerNotPay}>
            {
              (type)
                ? (params.value) ? 'PAGADO' : 'NO PAGADO'
                : (params.value) ? 'CUADRADO' : 'NO CUADRADO'
            
            }
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
      let r1;
      if(type){
        r1 = await giftcardService.getTickets(queryString);
      }else{
        r1 = await giftcardService.getTicketsCheck(queryString);
      }

      let rows;
      if(type){
        rows = r1.data.tickets.map((e) => {
          const statusTemp = e.statusPaid ? true : false;
          return {
            ...e,
            id: e.id,
            statusTemp
          };
        });
      }else{
        rows = r1.data.tickets.map((e) => {
          const statusTemp = e.statusCheck ? true : false;
          return {
            ...e,
            id: e.id,
            statusTemp
          };
        });
      }

      setRows(rows);
      setAmountTotal(r1.data.totalAmount);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleManageApproveMatch = () => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      onConfirm: () => {
        handleApproveMatch();
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de aprobar?',
      dlgSettings
    );
  }

  const handleApproveMatch = async () => {
    try {
      blockUI.current.open(true);
      let rowsTempActive = rows.filter((r)=>r.statusTemp);
      if(rowsTempActive.length > 0){
        const idsTicketMatch = rowsTempActive.map((e) => e.id);
        giftcardService.getAccessToken();

        if(type){
          await giftcardService.approveTicketMatch({idsTicketMatch});
        }else{
          await giftcardService.approveTicketCheck({idsTicketMatch});
        }
        dlgSettings = {
          ...dlgSettings,
          confirm: false,
          onConfirm: () => {},
        };
        dialogUI.current.open('', '', dlgSettings, 'APROBADOS');
        let newRows;

        if(type){
          newRows = rows.map((e) => {
            const statusTemp = (idsTicketMatch.includes(e.id)) ? true : false;
            return {
              ...e,
              id: e.id,
              statusTemp,
              statusPaid: statusTemp
            };
          });
        }else{
          newRows = rows.map((e) => {
            const statusTemp = (idsTicketMatch.includes(e.id)) ? true : false;
            return {
              ...e,
              id: e.id,
              statusTemp,
              statusCheck: statusTemp
            };
          });
        }
        setRows(newRows);
      }else{
        dlgSettings = {
          ...dlgSettings,
          confirm: false,
          onConfirm: () => {},
        };
        dialogUI.current.open('', '', dlgSettings, 'SELECCIONE AL MENOS UNO');
      }

      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  const handleCheckAll = () => {
    let toCheck = (page + 1) * 20;
    let atCheck = toCheck - 19;
    let total = amountTotal;
    let newRows = rows.map((r, index)=>{
      if(index >= (atCheck-1) && index <= (toCheck-1)){
        if(!r.statusTemp){
          total = total + r.amount;
          return {
            ...r,
            statusTemp: true
          }
        }else{
          return r;
        }
      }else{
        return r;
      }
    });
    setRows(newRows);
    setAmountTotal(total);
  }

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch("status=1,2");

      if(state.user.role === "EMPLOYEE_ROLE"){
        const newR1 = r1.data.partners.filter((e) => e.uid === state.user.partner._id);
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
    try {
      const headers = [
        'PARTNER',
        'MONTO',
        'ESTADO DE VERIFICACIÓN',
        'AUTORIZADOR',
        'FECHA DE ESCANEO',
        'ESTADO DE CUADRE'
      ];

      let dataExcel = [];
      let amountTotal = 0;
      rows.map((ticket)=>{
        if(type){
          if(ticket.statusPaid){
            amountTotal = amountTotal + ticket.amount;
            dataExcel.push([
              ticket.partner.name,
              `S/${ticket.amount}`,
              (ticket.status) ? 'DISPONIBLE' : 'CANJEADO',
              (ticket.authorizer?.name) ? ticket.authorizer?.name : '____',
              (ticket.dateScan) ? dateFormat(new Date(ticket.dateScan), "dd-mm-yy HH:MM") : '',
              (ticket.statusPaid) ? 'PAGADO' : 'NO PAGADO'
            ]);
          }
        }else{
          if(ticket.statusCheck){
            amountTotal = amountTotal + ticket.amount;
            dataExcel.push([
              ticket.partner.name,
              `S/${ticket.amount}`,
              (ticket.status) ? 'DISPONIBLE' : 'CANJEADO',
              (ticket.authorizer?.name) ? ticket.authorizer?.name : '____',
              (ticket.dateScan) ? dateFormat(new Date(ticket.dateScan), "dd-mm-yy HH:MM") : '',
              (ticket.statusCheck) ? 'CUADRADO' : 'NO CUADRADO'
            ]);
          }
        }
        
      });
      dataExcel.unshift(headers);
      dataExcel.push([
        ''
      ]);

      dataExcel.push([
        'MONTO TOTAL:',
        `S/${amountTotal}`
      ]);

      dataExcel.push([
        'RESPONSABLE:',
        `${state.user?.name}`
      ]);

      dataExcel.push([
        'CAJERO:'
      ]);
      dataExcel.push([
        'FIRMA:'
      ]);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tickets (canje)');
      worksheet.addRows(dataExcel);

      worksheet.columns.forEach((column, index) => {
        if (index === 0) {
          column.width = 40;
        } else {
          column.width = 25;
        }
      });

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
        a.download = `tickets(canje)_${nameFile}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      });

    } catch (error) {
    }    
  };

  const handleApprobeMatchTemp = async (id, status, amount) => {
    try {
      blockUI.current.open(true);
      const newRows = rows.map((e)=>{
        if(e.id === id){
          return {
            ...e,
            statusTemp: !status
          }
        }else{
          return e;
        }
      });

      let newStatus = !status;
      if(newStatus){
        setAmountTotal(amountTotal+amount);
      }else{
        setAmountTotal(amountTotal-amount);
      }
      setRows(newRows);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  }

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
              {
                (!partner)
                  ?
                    <Grid item md={4}>
                      {
                        (!type)
                          &&
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
                      }
                    </Grid>
                  :
                    <Grid item md={2}></Grid>
              }
              <Grid item xs={12} md={2}>
                <TextField
                  type="date"
                  id="startDate"
                  name="startDate"
                  autoComplete="date"
                  value={values.startDate || ''}
                  className={modalStyle.texfield}
                  placeholder="Escriba aqui ..."
                  margin="normal"
                  required
                  fullWidth
                  variant="outlined"
                  helpertext={
                    errors.startDate && touched.startDate ? errors.startDate : ""
                  }
                  error={!!(errors.startDate && touched.startDate)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{paddingRight: '7px'}}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  type="date"
                  id="endDate"
                  name="endDate"
                  autoComplete="date"
                  value={values.endDate || ''}
                  className={modalStyle.texfield}
                  placeholder="Escriba aqui ..."
                  margin="normal"
                  required
                  fullWidth
                  variant="outlined"
                  helpertext={
                    errors.endDate && touched.endDate ? errors.endDate : ""
                  }
                  error={!!(errors.endDate && touched.endDate)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{paddingRight: '7px'}}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                {
                  (!type)
                    &&
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
                }
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
                      <div>
                        <IconButton
                          component="label"
                          onClick={()=>{exportToExcel()}}
                          style={{backgroundColor: '#57c115', color: 'white'}}
                        >
                          <Tooltip title='DESCARGAR' placement="bottom">
                            <SaveAltIcon />
                          </Tooltip>
                        </IconButton>
                      </div>
                      {
                        (state.user.role === 'ADMIN_ROLE')
                          &&
                            <Grid container style={{marginTop: '30px'}}>
                              <Grid item xs={6} style={{textAlign: 'left', paddingLeft: '30px'}}>
                                <IconButton
                                  component="label"
                                  onClick={()=>{handleCheckAll()}}
                                  style={{backgroundColor: 'rgb(68 40 142)', color: 'white'}}
                                >
                                  <Tooltip title='SELECCIONAR TODA LA PÁGINA' placement="bottom">
                                    <LibraryAddCheckIcon />
                                  </Tooltip>
                                </IconButton>
                              </Grid>
                              <Grid item xs={6} style={{textAlign:'right'}}>
                                <Button
                                  variant="contained"
                                  onClick={handleManageApproveMatch}
                                >
                                  APROBAR
                                </Button>
                              </Grid>
                            </Grid>
                      }
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
            onPageChange={(e)=>{
              setPage(e);
            }}
            onRowClick={({row})=>{
              if(type){
                if(!row.statusPaid){
                  handleApprobeMatchTemp(row.id, row.statusTemp, row.amount)
                }
              }else{
                if(!row.statusCheck){
                  handleApprobeMatchTemp(row.id, row.statusTemp, row.amount)
                }
              }
            }}
          />
      </Grid>
      
    </div>
  )
}

export default ListTicket;
