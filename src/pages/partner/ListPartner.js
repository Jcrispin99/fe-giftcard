import React, { useState, useEffect } from 'react';
import { useUI } from '../../app/context/ui';
import { ListStyles } from '../../assets/css';
import { CategorieService, PartnerService } from '../../services';
import { PartnerStyles } from './components/partner-style';
import { Button, IconButton, Tooltip, Typography, Switch } from '@mui/material';
import dateFormat from "dateformat";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModalManager from './components/ModalManager';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Recycle from './components/Recycle';
import PaidIcon from '@mui/icons-material/Paid';

let dlgSettings = {
  confirm: true,
  btn: {
    close: 'CANCELAR',
    confirm: 'ELIMINAR',
  },
  onConfirm: () => {},
};

const partnerService = new PartnerService();

const ListPartner = () => {

  const listStyle = ListStyles();
  const classes = PartnerStyles();
  const { blockUI, dialogUI } = useUI();
  const [ rows, setRows ] = useState([]);
  const [ openModal, setOpenModal ] = useState(false);
  const [ openModalRecycle, setOpenModalRecycle ] = useState(false);
  const [ data, setData ] = useState({});

  const columns = [
    { 
      field: 'name', 
      headerName: 'NOMBRE', 
      flex: 0.4,
      minWidth: 200,
    },
    {
      field: '_id',
      headerName: 'ACCIONES',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>
            <IconButton 
              aria-label="edit" 
              onClick={()=>{}}
            >
              <Tooltip title="DEUDAS" placement="top">
                <PaidIcon />
              </Tooltip>
            </IconButton>
            <IconButton 
              aria-label="edit" 
              color="success" 
              onClick={()=>{handleEdit(params)}}
            >
              <Tooltip title="Editar" placement="top">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton 
              aria-label="delete" 
              color="primary"
              disabled={(params.row.name === 'OLYMPO')}
              onClick={()=>{handleDelete(params)}}
            >
              <Tooltip title="Eliminar" placement="top">
                <DeleteForeverIcon />
              </Tooltip>
            </IconButton>
          </div>
        )
      }
    },
  ];

  const handleEdit = (data) => {
    setData(data.row);
    setOpenModal(true);
  }

  const handleDelete = (data) => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      onConfirm: () => {
        onDeleteTable(data.row);
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de eliminarlo?',
      dlgSettings
    );
  }

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('status=1,2');
      const newPartner = r1.data.partners.filter((e)=>(e.name !== 'KDOSH'));
      let newRows = newPartner.map((e)=>({...e, id: e.uid}));
      setRows(newRows);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onDeleteTable = async(data) => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      await partnerService.update({
        ...data,
        status: 3
      },data.id);
      let newRows = rows.filter((e)=>(e.id !== data.id));
      setRows(newRows);
      blockUI.current.open(false);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        btn: {
          close: 'CERRAR',
        },
      };
      dialogUI.current.open('', '', dlgSettings, 'Eliminado correctamente');
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleCreate = () => {
    setData({});
    setOpenModal(true);
  };

  useEffect(() => {
    (async function init() {
      await getListPartner();
    })();
  }, []);

  return (
    <div style={{ height: 540, width: '100%', marginTop: '50px', marginBottom: '50px' }}>
      <Typography className={classes.title}>EMPRESAS</Typography>
      <Button
        onClick={handleCreate} 
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
        (openModal)
          &&
            <ModalManager
              open={openModal}
              setOpen={setOpenModal}
              setRows={setRows}
              rows={rows}
              data={data}
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

export default ListPartner;
