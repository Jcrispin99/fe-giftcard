import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ModalCustomStyles } from '../../assets/css';
import { useUI } from '../../app/context/ui';
import { UserService, GiftCardService } from '../../services';
import dateFormat from "dateformat";
import CreateGiftcard from './CreateGiftcard';
import PaidIcon from '@mui/icons-material/Paid';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CreateBuy from '../buy/CreateBuy';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import MyShopping from '../buy/MyShopping';

const userService = new UserService();
const giftCardService = new GiftCardService();

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'Cerrar',
  },
  onConfirm: () => {},
};

const ListGiftcard = () => {

  const modalStyle = ModalCustomStyles();
  const { blockUI, dialogUI } = useUI();
  const [dataUser, setDataUser] = useState({});
  const [giftCards, setGiftCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [giftCardReview, setGiftCardReview] = useState({});
  const [openBuy, setOpenBuy] = useState(false);
  const [openShopping, setOpenShopping] = useState(false);
  const [giftCardView, setGiftCardView] = useState({});
  const [idGiftcardShopping, setIdGiftcardShopping] = useState('');

  const baseValues = {
    type: '',
    dato: ''
  };

  const [initialValues, setInitialValues] = useState(baseValues);
  const validationSchema = Yup.object({
    type: Yup
      .string()
      .required('Obligatorio'),
    dato: Yup
      .string()
      .required('Obligatorio')
  });

  const onSubmit = async(values) => {
    try {
      blockUI.current.open(true);
      setDataUser({});
      setGiftCards([]);
      userService.getAccessToken();
      giftCardService.getAccessToken();
      if(values.type === 1){
        const r1 = await userService.listSearch(`limit=100&dni=${values.dato}`);
        if(r1.data.total > 0){
          setDataUser(r1.data.users[0]);
          const r2 = await giftCardService.mygiftcards(`user_id=${r1.data.users[0].uid}`);
          if(r2.data.total > 0){
            setGiftCards(r2.data.giftcard);
          }else{
            dialogUI.current.open('', '', dlgSettings, 'El usuario no tiene gift cards');
          }
        }else{
          dialogUI.current.open('', '', dlgSettings, 'No hay un registro con ese DNI');
        }
      }else{
        const r1 = await giftCardService.mygiftcards(`code=${values.dato}`);
        if(r1.data.total > 0){
          setGiftCards(r1.data.giftcard);
          setDataUser({
            uid: r1.data.giftcard[0].user._id,
            id: r1.data.giftcard[0].user._id,
            name: r1.data.giftcard[0].user.name,
          });
        }else{
          dialogUI.current.open('', '', dlgSettings, 'No hay un registro con ese número de gift card');
        }
      }
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleSenCard = async(gifcard) => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      await giftCardService.sendUrlToMessage({code:gifcard.code});
      blockUI.current.open(false);
      dialogUI.current.open('', '', dlgSettings, 'Mensaje enviado');
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  const handleViewShopping = (gifcard) => {
    setIdGiftcardShopping(gifcard);
    console.log('gifcard',gifcard);
    setOpenShopping(true);
  }

  const handleBuy = (giftcard) => {
    console.log('giftcard',giftcard);
    setGiftCardView(giftcard);
    setOpenBuy(true);
  }

  const handleEditGiftcard = (giftcard) => {
    setGiftCardReview(giftcard);
    setOpen(true);
  }

  const handleDeleteGiftcard = (giftcard) => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      onConfirm: () => {
        onDeleteGiftcard(giftcard);
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de eliminar esta giftcard?',
      dlgSettings
    );
  }

  const onDeleteGiftcard = async(giftcard) => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      await giftCardService.update({
        status: 3
      },giftcard.uid);

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
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel id="type">Tipo</InputLabel>
                        <Select
                          labelId="type"
                          id="type"
                          name="type"
                          value={values.type}
                          label="Tipo"
                          onChange={handleChange}
                          fullWidth
                          helpertext={
                            errors.type && touched.type ? errors.type : ""
                          }
                          error={!!(errors.type && touched.type)}
                        >
                          <MenuItem value={1}>DNI</MenuItem>
                          <MenuItem value={2}># GIFT CARD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        id="dato"
                        name="dato"
                        autoComplete="dato"
                        value={values.dato || ''}
                        className={modalStyle.texfield}
                        placeholder="Escriba aqui ..."
                        margin="normal"
                        required
                        fullWidth
                        variant="outlined"
                        helpertext={
                          errors.dato && touched.dato ? errors.dato : ""
                        }
                        error={!!(errors.dato && touched.dato)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={1} style={{paddingTop: '9px'}}>
                      <Tooltip title="Buscar" placement="right">
                        <IconButton 
                          color="primary" 
                          component="label"
                          onClick={()=>{handleSubmit()}}
                        >
                          <YoutubeSearchedForIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }}
          </Formik>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={3}></Grid>
          {
            (dataUser.uid)
              &&
                <Grid item xs={6} className={modalStyle.wrapperInfoGiftcard}>
                  <Grid container>
                    <Grid item xs={4}>{dataUser?.name}</Grid>
                    {/* <Grid item xs={4}>{dateFormat(new Date(dataUser?.createdAt), "dd/mm/yyyy")}</Grid> */}
                    <Grid item xs={4}>{`Total: ${giftCards?.length}`}</Grid>
                  </Grid>
                </Grid>
          }
        <Grid item xs={3}></Grid>
        {
          (dataUser.uid)
            &&
              <Grid item xs={12} className={modalStyle.wrapperCreateGiftcard}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={()=>{
                    setOpen(true);
                    setGiftCardReview({});
                  }}>
                  CREAR GIFT CARD
                </Button>
              </Grid>
        }
        <CreateGiftcard
          open={open}
          setOpen={setOpen}
          dataCard={giftCardReview}
          dataUser={dataUser}
          giftCards={giftCards}
          setGiftCards={setGiftCards}
        />
      </Grid>
      <Grid container>
        {
          (giftCards.length > 0)
            &&
              giftCards.map((e,index)=>(
                <Grid key={`giftcard-${index}`} item xs={6} className={modalStyle.wrapperViewGiftcard}>
                  <Grid container className='card6'>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={7} className='card3 gift-card animate__animated animate__rotateInDownRight'>
                      <Grid container>
                        <Grid item xs={6} className='btnViewBuys'>
                          <Button variant="outlined" color="error" onClick={()=>{handleViewShopping(e.uid)}}>
                            VER COMPRAS
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Enviar url de acceso" placement="bottom">
                            <IconButton 
                              color="primary" 
                              component="label"
                              onClick={()=>{handleSenCard(e)}}
                              size="large"
                              style={{color:'green'}}
                            >
                              <QuestionAnswerIcon/>
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Editar" placement="bottom">
                            <IconButton 
                              color="primary" 
                              component="label"
                              onClick={()=>{handleEditGiftcard(e)}}
                              size="large"
                              style={{color:'orange'}}
                            >
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Eliminar" placement="bottom">
                            <IconButton 
                              color="primary" 
                              component="label"
                              onClick={()=>{handleDeleteGiftcard(e)}}
                              size="large"
                              style={{color:'red'}}
                            >
                              <DeleteForeverIcon/>
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={1} className='card2 animate__animated animate__rotateInDownRight'>
                      <Tooltip title="COMPRAR" placement="right">
                        <IconButton 
                          color="primary" 
                          component="label"
                          onClick={()=>{handleBuy(e)}}
                          size="large"
                        >
                          <PaidIcon/>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                      <article className="gift-card animate__animated animate__rotateInDownLeft">
                        <div className="gift-card__image">
                        </div>
                        <section className="gift-card__content">
                          <div className="gift-card__amount">S/.{e.amountAvailable}</div>
                          <div className="gift-card__amount-remaining">Monto Inicial: S/{e.amount}</div>    
                          <div className="gift-card__code">{e.code}</div>
                          <div className="gift-card__msg">Código de Identificación</div>
                        </section>
                      </article>
                    </Grid>
                  </Grid>
                </Grid>
              ))
        }
      </Grid>
      {
        (giftCardView.uid)
          &&
            <CreateBuy
              openBuy={openBuy}
              setOpenBuy={setOpenBuy}
              giftCardBuy={giftCardView}
            />
      }
      
      {
        (idGiftcardShopping)
          &&
            <MyShopping
              openShopping={openShopping}
              setOpenShopping={setOpenShopping}
              idGiftcardShopping={idGiftcardShopping}
            />
      }
    </div>
  )
}

export default ListGiftcard;
