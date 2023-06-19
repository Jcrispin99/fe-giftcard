import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { 
  FormControl, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Select, 
  Tooltip 
} from '@mui/material';
import { useUI } from '../../../app/context/ui';
import { PartnerService, UserService } from '../../../services';
import SearchIcon from '@mui/icons-material/Search';

const partnerService = new PartnerService();
const userService = new UserService();

const Search = (props) => {

  const { setRows } = props;

  const { blockUI } = useUI();

  const [ dataAvailable, setDataAvailable ] = useState([]);

  const getList = async () => {
    try {
      blockUI.current.open(true);
      partnerService.getAccessToken();
      const r1 = await partnerService.listSearch('status=1,2');
      const newR1 = r1.data.partners.filter((e)=>(e.name !== 'KDOSH'));
      setDataAvailable(newR1);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      const queryString = Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      userService.getAccessToken();
      const r1 = await userService.searchBussiness(queryString);
      const newData = r1.data.partners.map((e)=>({...e, id: e.uid}));
      setRows(newData);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getList();
    })();
  }, []);

  return (
    <Formik
      initialValues={{
        data: '',
      }}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(props) => {
        const {
          values,
          handleChange,
          handleSubmit,
        } = props;
        return(
          <Grid container style={{marginTop: '20px'}}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <FormControl style={{width: '100%', paddingRight: '7px'}}>
                <InputLabel id="dataLabel">EMPRESA</InputLabel>
                <Select
                  labelId="dataLabel"
                  id="data"
                  label="Empresa"
                  name="data"
                  onChange={handleChange}
                  value={values.data}
                  fullWidth
                  style={{textAlign: 'center'}}
                >
                  <MenuItem value={''} key={`bussiness${0}`}>LIMPIAR</MenuItem>
                  {
                    dataAvailable.map((data, index)=>(
                      <MenuItem value={data.uid} key={`data${index}`}>{data.name}</MenuItem>
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
  )
}

export default Search;
