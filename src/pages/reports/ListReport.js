import React, { useState, useEffect } from 'react'
import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { Formik } from 'formik';
import { useUI } from '../../app/context/ui';
import { ListStyles, ModalCustomStyles } from '../../assets/css';
import SearchIcon from '@mui/icons-material/Search';
import { GiftCardService, UserService } from '../../services';
import { EmployeeStyles } from '../employee/components/employees-style';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import dateFormat from 'dateformat';
import store from '../../redux/store';
import ExcelJS from 'exceljs';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { useHistory } from "react-router-dom";

const userService = new UserService();
const giftcardService = new GiftCardService();

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
  },
  onConfirm: () => {},
};

const ListReport = () => {
  
  const history = useHistory();
  const state = store.getState();
  const partner = (state.user?.partner) ? state.user.partner : '';

  if(partner && (partner.name !== 'OLYMPO' && partner.name !== 'KDOSH')){
    history.push("/ticket");
  }

  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const [amountTotal, setAmountTotal] = useState(0);
  const [dataExport, setDataExport] = useState([]);
  const [page, setPage] = useState(0);
  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    startDate: dateFormat(new Date(), 'yyyy-mm-dd'),
    endDate: dateFormat(new Date(), 'yyyy-mm-dd'),
    creator: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues);
  const [creatorAvailable, setCreatorAvailable] = useState([]);
  const [rows, setRows] = useState([]);

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
                disabled={params.row.statusMatch}
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
      field: '_id', 
      headerName: 'CLIENTE', 
      width: 300,
      minWidth: 300,
      renderCell: (params) => {
        return (
          <div>
            {params.row.user.name}
          </div>
        )
      }
    },
    { 
      field: 'code', 
      headerName: 'GIFTCARD', 
      width: 140,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <div>
            {params.value}
          </div>
        )
      }
    },
    { 
      field: 'amount', 
      headerName: 'MONTO', 
      width: 100,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div>
            {`S/.${params.value}`}
          </div>
        )
      }
    },
    { 
      field: 'type', 
      headerName: 'MÉTODO DE PAGO', 
      width: 150,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div>
            {`${params.value}`}
          </div>
        )
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'F. CREACIÓN', 
      width: 130,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <div>
            {dateFormat(new Date(params.value), "dd-mm-yy HH:MM")}
          </div>
        )
      }
    },
    { 
      field: 'statusMatch', 
      headerName: 'ESTADO CUADRE', 
      width: 250,
      renderCell: (params) => {
        return (
          <div className={params.value ? listStyle.containerMatch : listStyle.containerNotMatch}>
            {(params.value) ? 'SUPERVISADO' : 'NO SUPERVISADO'}
          </div>
        )
      },
    }
  ];

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      const queryString = Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      giftcardService.getAccessToken();
      const r1 = await giftcardService.getReportGiftcard(queryString);
      const rows = r1.data.giftcards.map((e) => {
        const statusTemp = e.statusMatch ? true : false;
        return {
          ...e,
          id: e.uid,
          statusTemp
        };
      });
      setRows(rows);
      // customizeExport(r1.data.giftcards);
      setAmountTotal(r1.data.totalAmount);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
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

  const getListCreators = async () => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      const r1 = await userService.listAuthorizers('');

      if(state.user.role === "EMPLOYEE_ROLE"){
        const newR1 = r1.data.users.filter((e) => e.uid === state.user.uid);
        setCreatorAvailable(newR1);
        setInitialValues(prevValues => ({
          ...prevValues,
          creator: newR1[0].uid
        }));
      }else{
        setCreatorAvailable(r1.data.users);
      }

      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleManageApproveMatch = (id, status, amount) => {
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
        const idsGiftcardsMatch = rowsTempActive.map((e) => e.id);
        await giftcardService.approveGiftcardMatch({idsGiftcardsMatch});
        dlgSettings = {
          ...dlgSettings,
          confirm: false,
          onConfirm: () => {},
        };
        dialogUI.current.open('', '', dlgSettings, 'APROBADOS');

        const newRows = rows.map((e) => {
          const statusTemp = (idsGiftcardsMatch.includes(e.id)) ? true : false;
          return {
            ...e,
            id: e.uid,
            statusTemp,
            statusMatch: statusTemp
          };
        });
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

  const exportToExcel = () => {
    try {
      const headers = [
        'CLIENTE',
        'GIFTCARD',
        'MONTO',
        'MÉTODO DE PAGO',
        'FECHA DE CREACIÓN',
        'ESTADO DE CUADRE'
      ];

      let dataExcel = [];
      let amountTotal = 0;
      rows.map((row)=>{
        if(row.statusMatch){
          amountTotal = amountTotal + row.amount;
          dataExcel.push([
            row.user?.name,
            row.code,
            `S/${row.amount}`,
            row.type,
            (row.createdAt) ? dateFormat(new Date(row.createdAt), "dd-mm-yy HH:MM") : '',
            (row.statusMatch) ? 'SUPERVISADO' : 'NO SUPERVISADO'
          ]);
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
      const worksheet = workbook.addWorksheet('Reportes (ventas)');
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
        a.download = `reportes(venta)_${nameFile}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
    }
  };

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

  useEffect(() => {
    (async function init() {
      await getListCreators();
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
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={2}>
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
              <Grid item xs={2}>
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
              <Grid item xs={2}>
                <FormControl style={{width: '100%', paddingRight: '7px'}}>
                  <InputLabel id="creatorLabel">Creador</InputLabel>
                  <Select
                    labelId="creatorLabel"
                    id="creator"
                    label="Creador"
                    name="creator"
                    value={values.creator}
                    onChange={handleChange}
                    fullWidth
                  >
                      <MenuItem value={''} key={`authorizer${0}`}>LIMPIAR</MenuItem>
                    {
                      creatorAvailable.map((creator, index)=>(
                        <MenuItem value={creator.uid} key={`creator${index}`}>{creator.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} style={{textAlign: 'center', paddingTop: '7px'}}>
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
        
      <Grid container style={{ height: 1156, width: '100%', marginTop: '50px' }}>
          <DataGrid
            className={clsx(listStyle.dataGrid, classes.root)} 
            rows={rows}
            columns={columns}
            pageSize={20}
            onPageChange={(e)=>{
              setPage(e);
            }}
            onRowClick={({row})=>{
              if(!row.statusMatch){
                handleApprobeMatchTemp(row.id, row.statusTemp, row.amount)
              }
            }}
          />
      </Grid>
      
    </div>
  )
}

export default ListReport;
