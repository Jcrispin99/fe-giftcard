import React, { useEffect, useState } from 'react';
import { IconButton, Modal, Tooltip } from '@mui/material';
import 'animate.css';
import _ from 'lodash';
import { PartnerService } from '../../../services';
import { useUI } from '../../../app/context/ui';
import { ListStyles, ModalCustomStyles } from '../../../assets/css';
import RestoreIcon from '@mui/icons-material/Restore';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'CERRAR',
  },
  onConfirm: () => {},
};

const partnerService = new PartnerService();

const LocalStyles = makeStyles(() => ({
  table: { 
    height: 540, 
    width: '100%', 
    marginTop: '50px', 
    marginBottom: '50px' 
  },
  title: {
    textAlign: 'center',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#ff000014',
    color: '#9b0000'
  }
}));

const Recycle = (props) => {

  const { openR, setOpenR } = props;

  const { blockUI, dialogUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const localStyle = LocalStyles();
  const [ rows, setRows ] = useState([]);

  const getListPartner = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('status=3');
      let newRows = r1.data.partners.map((e)=>({...e, id: e.uid}));
      setRows(newRows);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

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
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Recuperar" placement="top">
              <IconButton aria-label="delete" color="primary" onClick={()=>{handleRecover(params)}}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    },
  ];

  const handleRecover = async (param) => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      await partnerService.recover(param.row.id);
      let newRows = rows.filter((e)=>(e.id !== param.row.id));
      setRows(newRows);
      blockUI.current.open(false);
      dialogUI.current.open('', '', dlgSettings, 'Recuperado correctamente');
      window.location.reload();
    } catch (error) {
      blockUI.current.open(false);
    }
  }

  useEffect(() => {
    (async function init() {
      await getListPartner();
    })();
  }, []);

  return (
    <>
      <Modal
        open={openR}
        onClose={() => setOpenR(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableEscapeKeyDown={true}
        className="animate__animated animate__backInLeft"
      >
        <div className={modalStyle.paperModal} style={{width: '500px'}}>
          <div className={localStyle.title}>
            PAPELERA
          </div>
          <div className={localStyle.table}>
            <DataGrid
              className={clsx(listStyle.dataGrid)}
              rows={rows} 
              columns={columns}
              pageSize={20}
              pageSizeOptions={[20,50,100]}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Recycle;
