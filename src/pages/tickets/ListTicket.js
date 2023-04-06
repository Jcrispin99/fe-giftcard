import { Grid, IconButton, TextField } from '@mui/material';
import { Formik } from 'formik';
import React, { useState} from 'react'
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import SearchIcon from '@mui/icons-material/Search';
import * as Yup from 'yup';
import { BuyService } from '../../services';


const buyService = new BuyService();

const ListTicket = () => {

  const modalStyle = ModalCustomStyles();
  const { blockUI, dialogUI } = useUI();

  const baseValues = {
    date: '',
  };

  const [initialValues, setInitialValues] = useState(baseValues);  
  const [buys, setBuys] = useState([]);  

  const validationSchema = Yup.object({
    date: Yup
      .date()
      .required('Obligatorio'),
  });

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      console.log('values',values)
      buyService.getAccessToken();
      const {data:buys} = await buyService.listSearch(`created_at=${values.date}`);
      console.log('buys',buys);
      setBuys(buys.data);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  return (
    <div style={{marginTop: '40px'}}>
      <Grid container>
        <Grid item xs={4}></Grid>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={11}>
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
                    <Grid item xs={1}>
                      <IconButton
                        color="primary" 
                        component="label"
                        onClick={()=>{handleSubmit()}}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }}
          </Formik>
        <Grid item xs={4}></Grid>
      </Grid>
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
