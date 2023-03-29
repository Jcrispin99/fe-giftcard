import React, { useState, useEffect } from 'react';
import { useUI } from '../../app/context/ui';
import { ListStyles } from '../../assets/css';
import { UserService } from '../../services';
import { EmployeeStyles } from './components/employees-style';
import { Button, IconButton, Tooltip, Typography, Switch } from '@mui/material';
import dateFormat from "dateformat";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmployeeManager from './components/EmployeeManager';

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


  const handleChangeStatus = async (e,customer) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      let checked = (e.target.checked) ? 1 : 2;
      await userService.update({status: checked}, customer.id);
      let newRows = rows.map((employee)=>{
        if(employee.id === customer.id){
          return {
            ...employee,
            status: checked
          }
        }else{
          return employee;
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
      field: 'fullName', 
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
      field: 'createdAt', 
      headerName: 'F.CREACIÓN', 
      width: 150,
      valueGetter: (params) => {
        return dateFormat(new Date(params.value), "dd/mm/yyyy");
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
          />
        )
      }
    },
    {
      field: 'firstName',
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
        onDeleteEmployee(employee.id);
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
      const r1 = await userService.listSearch('sort=-id&role=employee&status=3');
      setRows(r1.data.data);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onDeleteEmployee = async(id) => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      await userService.update({
        status: 3
      },id);
      let newRows = rows.filter((e)=>(e.id !== id));
      setRows(newRows);
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        btn: {
          close: 'Close',
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
        // className={classes.btnCreate} 
        onClick={handleCreateEmployee} 
        variant="outlined" 
        startIcon={<AddCircleOutlineIcon />}
      >
        CREAR
      </Button>
      <DataGrid
        className={clsx(listStyle.dataGrid, classes.root)} 
        rows={rows} 
        columns={columns}
        pageSize={20}
        pageSizeOptions={[20,50,100]}
      />
      <EmployeeManager
        open={openModalEmployee}
        setOpen={setOpenModalEmployee}
        setRows={setRows}
        rows={rows}
        dataEmployee={dataEmployee}
      />
    </div>
  )
}

export default ListEmployee