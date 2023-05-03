import React, { useState, useEffect } from 'react'
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import SearchIcon from '@mui/icons-material/Search';
import * as Yup from 'yup';
import { BuyService, PartnerService } from '../../services';


const buyService = new BuyService();
const partnerService = new PartnerService();

const ListTicket = () => {

  const modalStyle = ModalCustomStyles();
  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    date: '',
    partner: '',
    authorizer: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues); 
  const [partnerAvailable, setPartnersAvailable] = useState([]);
 
  const [buys, setBuys] = useState([]);  

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      buyService.getAccessToken();
      const {data:buys} = await buyService.listSearch(`created_at=${values.date}`);
      setBuys(buys.data);
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

  useEffect(() => {
    (async function init() {
      await getListPartner();
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
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="partnerLabel">Partner</InputLabel>
                      <Select
                        labelId="partnerLabel"
                        id="partner"
                        label="Partner"
                        name="partner"
                        onChange={handleChange}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    {/* <Select
                      displayEmpty
                      id="partner"
                      name="partner"
                      value={values.partner}
                      onChange={handleChange}
                      size='small'
                      label='asdf'
                      error={touched.partner && Boolean(errors.partner)}
                      helpertext={
                        errors.partner && touched.partner ? errors.partner : ""
                      }
                      fullWidth
                    >
                      {
                        partnerAvailable.map((e, index)=>(
                          <MenuItem key={`partner${index}`} value={e.uid}>{e.name}</MenuItem>
                        ))
                      }
                    </Select> */}
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
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      color="primary" 
                      component="label"
                      onClick={()=>{handleSubmit()}}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            }}
          </Formik>
        
      <Grid container>
        {
          (buys.length > 0)
            ?
              buys.map((buy, index)=>(
                <div key={`buy${index}`} className={modalStyle.ticket}>
                  <div>{buy.product}</div>
                  <div>{buy.amount} PEN</div>
                  <div>{buy.createdAt}</div>
                </div>
              ))
            :
              <Grid item xs={12} className={modalStyle.wrapperNotBuys}>
                No hay registros
              </Grid>
        }
      </Grid>
    </div>
  )
}

export default ListTicket;
