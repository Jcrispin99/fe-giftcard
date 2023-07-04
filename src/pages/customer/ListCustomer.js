import React, { useState, useEffect } from 'react';
import { useUI } from '../../app/context/ui';
import { ListStyles } from '../../assets/css';
import { CategorieService, UserService } from '../../services';
import { EmployeeStyles } from './components/employees-style';
import { Button, IconButton, Tooltip, Typography, Switch, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomerManager from './components/CustomerManager';
import store from '../../redux/store';
import { Formik } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import LockClockIcon from '@mui/icons-material/LockClock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from 'react-router-dom';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Recycle from './components/Recycle';

let dlgSettings = {
  confirm: true,
  btn: {
    close: 'CANCELAR',
    confirm: 'ELIMINAR',
  },
  onConfirm: () => {},
};

const userService = new UserService();
const categorieService = new CategorieService();

const ListCustomer = () => {

  const baseValues = {
    categorie: '',
  };
  const history = useHistory();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const { blockUI, dialogUI } = useUI();
  const [rows, setRows] = useState([]);
  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [dataEmployee, setDataEmployee] = useState({});
  const state = store.getState();
  const [initialValues, setInitialValues] = useState(baseValues);
  const [categorieAvailable, setCategorieAvailable] = useState([]);
  const [ openModalRecycle, setOpenModalRecycle ] = useState(false);

  const handleChangeStatus = async (e,employee) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      let checked = (e.target.checked) ? 1 : 2;
      await userService.update({...employee.row, status: checked}, employee.id);
      let newRows = rows.map((emp)=>{
        if(emp.id === employee.id){
          return {
            ...emp,
            status: checked
          }
        }else{
          return emp;
        }
      });
      setRows(newRows);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  const columns = [
    { 
      field: 'name', 
      headerName: 'NOMBRE COMPLETO',
      width: 300,
      minWidth: 300,
    },
    { 
      field: 'dni', 
      headerName: 'DNI', 
      width: 100,
      minWidth: 100
    },
    { 
      field: 'phone', 
      headerName: 'CELULAR', 
      width: 120,
      minWidth: 120
    },
    { 
      field: 'categorie', 
      headerName: 'CATEGORÍA', 
      width: 200,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>{ params.row.categorie?.name || '' }</div>
        )
      }
    },
    { 
      field: 'giftcards', 
      headerName: 'GIFTCARDS (monto disponible)', 
      width: 300,
      minWidth: 300,
      renderCell: (params) => {
        let giftcards = params.row.giftcards;
        return (
          <div style={{display: 'contents'}}>
            {
              giftcards.map((giftcard, index)=>(
                <Tooltip key={`giftcard_${index}`} title={`MONTO INICIAL= S/${giftcard.amount}`} placement="top-start">
                  <div className={(giftcard.amountAvailable === giftcard.amount) ? classes.giftcardGreen : (giftcard.amountAvailable > 0) ? classes.giftcardOrange  : classes.giftcardRed}>
                    <span style={{fontSize: '8px'}}>S/.</span>{giftcard.amountAvailable}
                  </div>
                </Tooltip>
              ))
            }
          </div>
        )
      }
    },
    {
      field: 'status',
      headerName: 'ESTADO',
      width: 100,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Switch
            checked={(params.value===1) ? true : false }
            onChange={(e)=>{handleChangeStatus(e,params)}}
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={state.user.role === 'EMPLOYEE_ROLE'}
          />
        )
      }
    },
    {
      field: 'uid',
      headerName: 'ACCIONES',
      with: 190,
      minWidth: 190,
      renderCell: (params) => {
        return (
          <div>
            <IconButton 
              aria-label="edit" 
              color="success" 
              onClick={()=>{handleViewDetail(params.row.dni)}}
              disabled={state.user.role === 'EMPLOYEE_ROLE' || state.user.role === 'PARTNER_ROLE'}
            >
              <Tooltip title="Ver detalles" placement="top">
                <VisibilityIcon sx={{color:'orange'}}/>
              </Tooltip>
            </IconButton>
            <IconButton 
              aria-label="edit" 
              color="success" 
              onClick={()=>{handleEditEmployee(params)}}
              disabled={state.user.role === 'EMPLOYEE_ROLE' || state.user.role === 'PARTNER_ROLE'}
            >
              <Tooltip title="Editar datos generales" placement="top">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton 
              aria-label="delete" 
              color="primary" 
              onClick={()=>{handleDeleteEmployee(params)}}
              disabled={state.user.role === 'EMPLOYEE_ROLE' || state.user.role === 'PARTNER_ROLE'}
            >
              <Tooltip title="Eliminar" placement="top">
                <DeleteForeverIcon />
              </Tooltip>
            </IconButton>
            <IconButton 
              aria-label="delete" 
              color="primary" 
              onClick={()=>{handleReinitializePassword(params)}}
            >
              <Tooltip title="Reiniciar contraseña a DNI" placement="top">
                <LockClockIcon style={{color:'red'}}/>
              </Tooltip>
            </IconButton>
          </div>
        )
      }
    },
  ];

  const handleEditEmployee = (employee) => {
    setDataEmployee(employee.row);
    setOpenModalEmployee(true);
  }

  const handleViewDetail = (dni) => {
    try {
      blockUI.current.open(true);
      history.push({
        pathname: '/giftcard',
        state: { dni }
      });
      blockUI.current.open(false);
    } catch (error) {
      blockUI.current.open(false);
    }
  }

  const handleReinitializePassword = (employee) => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      btn: {
        close: 'CANCELAR',
        confirm: 'ACEPTAR',
      },
      onConfirm: () => {
        onReinitializePassword(employee);
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de reiniciar su contraseña?',
      dlgSettings
    );
  }

  const handleDeleteEmployee = (employee) => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      onConfirm: () => {
        onDeleteEmployee(employee);
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de eliminar este usuario?',
      dlgSettings
    );
  }

  const getListUser = async () => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      const r1 = await userService.listCustomers('status=1,2');
      setRows(r1.data.users);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onReinitializePassword = async(employee) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      await userService.reinitializerPasswordCustomer({id: employee.id});
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        btn: {
          close: 'Cerrar',
        },
      };
      dialogUI.current.open('', '', dlgSettings, 'Actualizado correctamente');
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onDeleteEmployee = async(employee) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      await userService.update({
        ...employee.row,
        status: 3
      },employee.id);
      let newRows = rows.filter((e)=>(e.id !== employee.id));
      setRows(newRows);
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        btn: {
          close: 'Cerrar',
        },
      };
      dialogUI.current.open('', '', dlgSettings, 'Eliminado correctamente');
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleCreateEmployee = () => {
    setOpenModalEmployee(true);
    setDataEmployee({});
  };

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      const queryString = Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      userService.getAccessToken();
      const r1 = await userService.listCustomers(`${queryString}&status=1,2`);
      const newData = r1.data.users.map((e)=>({...e, id: e.uid}));
      setRows(newData);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const getListCategorie = async () => {
    try {
      blockUI.current.open(true);
      categorieService.getAccessToken();
      const r1 = await categorieService.listSearch('status=1,2');
      setCategorieAvailable(r1.data.categories);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getListUser();
      await getListCategorie();
    })();
  }, []);

  return (
    <div style={{ height: 540, width: '100%', marginTop: '50px' }}>
      <Typography className={classes.title}>CLIENTES</Typography>

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
            <Grid container style={{marginTop: '20px'}}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <FormControl style={{width: '100%', paddingRight: '7px'}}>
                  <InputLabel id="categoriaLabel">CATEGORÍA</InputLabel>
                  <Select
                    labelId="categoriaLabel"
                    id="categorie"
                    label="Categoría"
                    name="categorie"
                    onChange={handleChange}
                    value={values.categorie}
                    fullWidth
                    style={{textAlign: 'center'}}
                  >
                    <MenuItem value={''} key={`categorie${0}`}>LIMPIAR</MenuItem>
                    {
                      categorieAvailable.map((categorie, index)=>(
                        <MenuItem value={categorie._id} key={`categorie${index}`}>{categorie.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}></Grid>
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

      <Button
        onClick={handleCreateEmployee} 
        variant="outlined" 
        startIcon={<AddCircleOutlineIcon />}
        style={{marginBottom: '16px'}}
        // disabled={state.user.role === 'EMPLOYEE_ROLE'}
      >
        CREAR
      </Button>

      <Button
        onClick={()=>{setOpenModalRecycle(true)}} 
        variant="outlined" 
        startIcon={<RestoreFromTrashIcon />}
        style={{marginBottom: '16px', marginLeft: '16px', color: 'red', border: 'solid 1px red'}}
      >
        PAPELERA
      </Button>

      <Box style={{marginTop: '33px', fontSize: '11px'}}>
        <div style={{marginBottom: '8px'}}>
          <span className={classes.giftcardGreen}>S/.XX</span> TARJETA NO CONSUMIDA
        </div>
        <div style={{marginBottom: '8px'}}>
          <span className={classes.giftcardOrange}>S/.XX</span> TARJETA CONSUMIDA CON SALDO DISPONIBLE
        </div>
        <div>
          <span className={classes.giftcardRed}>S/.XX</span> TARJETA SIN SALDO
        </div>
      </Box>

      <Grid container style={{ height: 560, width: '100%', marginTop: '50px' }}>
        <DataGrid
          className={clsx(listStyle.dataGrid, classes.root)} 
          rows={rows} 
          columns={columns}
          pageSize={20}
          pageSizeOptions={[20,50,100]}
        />
      </Grid>

      {
        (openModalEmployee)
          &&
            <CustomerManager
              open={openModalEmployee}
              setOpen={setOpenModalEmployee}
              setRows={setRows}
              rows={rows}
              dataEmployee={dataEmployee}
            />
      }

      {
        (openModalRecycle)
          &&
            <Recycle
              openR={openModalRecycle}
              setOpenR={setOpenModalRecycle}
            />
      }
      
    </div>
  )
}

export default ListCustomer;
