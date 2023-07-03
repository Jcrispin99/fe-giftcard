import React, { useState, useEffect } from 'react';
import { useUI } from '../../app/context/ui';
import { ListStyles } from '../../assets/css';
import { UserService } from '../../services';
import { EmployeeStyles } from './components/employees-style';
import { Button, IconButton, Tooltip, Typography, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmployeeManager from './components/EmployeeManager';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Recycle from './components/Recycle';

let dlgSettings = {
  confirm: true,
  btn: {
    close: 'Cancel',
    confirm: 'Delete',
  },
  onConfirm: () => {},
};

const userService = new UserService();

const ListEmployee = () => {

  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const { blockUI, dialogUI } = useUI();
  const [rows, setRows] = useState([]);
  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [dataEmployee, setDataEmployee] = useState({});
  const [ openModalRecycle, setOpenModalRecycle ] = useState(false);

  const handleChangeStatus = async (e,employee) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      let checked = (e.target.checked) ? 1 : 2;
      await userService.update({
        id: employee.row.id, 
        dni: employee.row.dni, 
        status: checked,
        role: employee.row.role
      }, employee.id);

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
      flex: 0.4,
      minWidth: 200,
    },
    { 
      field: 'dni', 
      headerName: 'DNI', 
      width: 150
    },
    { 
      field: 'email', 
      headerName: 'CORREO', 
      width: 250
    },
    { 
      field: 'phone', 
      headerName: 'CELULAR', 
      width: 250
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
          />
        )
      }
    },
    {
      field: 'uid',
      headerName: 'ACCIONES',
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Editar" placement="top">
              <IconButton aria-label="edit" color="success" onClick={()=>{handleEditEmployee(params)}}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" placement="top">
              <IconButton aria-label="delete" color="primary" onClick={()=>{handleDeleteEmployee(params)}}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    },
  ];

  const handleEditEmployee = (employee) => {
    setDataEmployee(employee.row);
    setOpenModalEmployee(true);
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
      const r1 = await userService.listSearch("status=1,2");
      const newData = r1.data.users.map((e)=>({...e, id: e.uid}));
      setRows(newData);
      blockUI.current.open(false);
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
  };

  useEffect(() => {
    (async function init() {
      await getListUser();
    })();
  }, []);

  return (
    <div style={{ height: 540, width: '100%', marginTop: '50px' }}>
      <Typography className={classes.title}>EMPLEADOS</Typography>
      <Button
        onClick={handleCreateEmployee} 
        variant="outlined" 
        startIcon={<AddCircleOutlineIcon />}
        style={{marginBottom: '16px'}}
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
      <DataGrid
        className={clsx(listStyle.dataGrid, classes.root)} 
        rows={rows} 
        columns={columns}
        pageSize={20}
        pageSizeOptions={[20,50,100]}
      />

      {
        (openModalEmployee)
          &&
            <EmployeeManager
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

export default ListEmployee;
