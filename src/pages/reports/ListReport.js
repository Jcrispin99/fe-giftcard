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
import store from '../../redux/store';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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

const ListReport = () => {

  const modalStyle = ModalCustomStyles();
  const listStyle = ListStyles();
  const classes = EmployeeStyles();
  const state = store.getState();
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const [amountTotal, setAmountTotal] = useState(0);
  const [idsGiftcardsCompliant, setIdsGiftcardsCompliant] = useState([]);

  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    date: '',
    partner: '',
    authorizer: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues); 
  const [partnerAvailable, setPartnersAvailable] = useState([]);
  const [creatorAvailable, setCreatorAvailable] = useState([]);
  const [rows, setRows] = useState([]);

  const columns = [
    { 
      field: '_id', 
      headerName: 'CLIENTE', 
      flex: 0.4,
      minWidth: 200,
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
      flex: 0.4,
      minWidth: 200,
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
      width: 250,
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
      width: 250,
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
      field: 'statusCompliant', 
      headerName: 'ESTADO CONFORMIDAD', 
      width: 250,
      renderCell: (params) => {
        return (
          <div className={params.value ? listStyle.containerPay : listStyle.containerNotPay}>
            {(params.value) ? 'CONFORME' : 'NO CONFORME'}
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
      const r1 = await giftcardService.getReportGiftcard(queryString);
      let giftcardsCompliant = [];
      const rows = r1.data.giftcards.map((e)=>{
        giftcardsCompliant.push(e.uid);
        return{
            ...e,
            id: e.uid
        }
      });
      setRows(rows);
      setAmountTotal(r1.data.totalAmount);
      setIdsGiftcardsCompliant(giftcardsCompliant);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const getListCreators = async () => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      const r1 = await userService.listAuthorizers('');
      setCreatorAvailable(r1.data.users);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleCompliantApprove = async () => {
    try {
        blockUI.current.open(true);
        giftcardService.getAccessToken();
        await giftcardService.approveGiftcardCompliant({idsGiftcardsCompliant});
        dialogUI.current.open('', '', dlgSettings, 'CONFORME');
        const newStatus = rows.map((e)=>({
            ...e,
            statusCompliant: true
        }));
        setRows(newStatus);
        blockUI.current.open(false);
      } catch (e) {
        blockUI.current.open(false);
      }
  };

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
              <Grid item xs={3}>
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
              <Grid item xs={3}>
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
                {
                    (state.user.role === 'ADMIN_ROLE')
                        &&
                        <IconButton
                            component="label"
                            onClick={()=>{handleCompliantApprove()}}
                            style={{backgroundColor: '#00beff2b'}}
                            disabled={(idsGiftcardsCompliant.length === 0) && true}
                        >
                            <Tooltip title='APROBAR TODO' placement="bottom">
                                <DoneAllIcon />
                            </Tooltip>
                        </IconButton>
                }
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

export default ListReport;
