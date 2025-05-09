import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ModalCustomStyles } from '../../assets/css';
import { useUI } from '../../app/context/ui';
import { UserService, GiftCardService } from '../../services';
import { v4 as uuidv4 } from 'uuid';
import CreateGiftcard from './CreateGiftcard';
import PaidIcon from '@mui/icons-material/Paid';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CreateBuy from '../buy/CreateBuy';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import MyShopping from '../buy/MyShopping';
import store from '../../redux/store';
import LockClockIcon from '@mui/icons-material/LockClock';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import SellIcon from '@mui/icons-material/Sell';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import PaperBinGiftcard from './PaperBinGiftcard';

const userService = new UserService();
const giftCardService = new GiftCardService();

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'Cerrar',
  },
  onConfirm: () => {},
};

const ListGiftcard = (props) => {

  const { dni, type } = props;
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
  const [newRequest, setNewRequest] = useState('');
  const state = store.getState();
  const [openPaperBin, setOpenPaperBin] = useState(false);
  const [idCustomerPaperBin, setIdCustomerPaperBin] = useState(0);
  const baseValues = {
    type: "1",
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

  const onSubmit = async (values) => {
    try {
      blockUI.current.open(true);
      setDataUser({});
      setGiftCards([]);
      userService.getAccessToken();
      giftCardService.getAccessToken();

      switch (values.type) {
        case "1":
          const userResponse = await userService.listSearch(`dni=${values.dato}`);
          if (userResponse.data.total > 0) {
            const user = userResponse.data.users[0];
            setDataUser(user);

            const giftCardResponse = await giftCardService.mygiftcards(`user_id=${user.uid}`);
            if (giftCardResponse.data.total > 0) {
              setGiftCards(giftCardResponse.data.giftcard);
            } else {
              dialogUI.current.open('', '', dlgSettings, 'El usuario no tiene gift cards');
            }
          } else {
            dialogUI.current.open('', '', dlgSettings, 'No hay un registro con ese DNI');
          }
          break;

        case "2":
          const giftCardResponse = await giftCardService.mygiftcards(`code=${values.dato}`);
          if (giftCardResponse.data.total > 0) {
            const giftCard = giftCardResponse.data.giftcard[0];
            setGiftCards(giftCardResponse.data.giftcard);
            setDataUser({
              uid: giftCard.user._id,
              id: giftCard.user._id,
              name: giftCard.user.name,
            });
          } else {
            dialogUI.current.open('', '', dlgSettings, 'No hay un registro con ese número de gift card');
          }
          break;

        default:
          dialogUI.current.open('', '', dlgSettings, 'Tipo de búsqueda no válido');
          break;
      }

      blockUI.current.open(false);
    } catch (e) {
      console.error("Error in onSubmit:", e);
      blockUI.current.open(false);
    }
  };

  const handleActiveLost = async(gifcard) => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      await giftCardService.activeLost({id:gifcard.uid});
      blockUI.current.open(false);
      dlgSettings = {
        confirm: false,
        btn: {
          close: 'CERRAR',
        },
        onConfirm: () => {},
      };
      dialogUI.current.open('', '', dlgSettings, 'ACTIVADO');
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  const handleSenCard = async(gifcard) => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      await giftCardService.sendUrlToMessage({code:gifcard.code});
      blockUI.current.open(false);
      dlgSettings = {
        confirm: false,
        btn: {
          close: 'CERRAR',
        },
        onConfirm: () => {},
      };
      dialogUI.current.open('', '', dlgSettings, 'Mensaje enviado');
    } catch (e) {
      blockUI.current.open(false);
    }
  }

  const handleViewShopping = (gifcard) => {
    setIdGiftcardShopping(gifcard);
    setNewRequest(uuidv4());
    setOpenShopping(true);
  }

  const handleBuy = (giftcard) => {
    setGiftCardView(giftcard);
    setOpenBuy(true);
  }

  const handleEditGiftcard = (giftcard) => {
    setGiftCardReview(giftcard);
    setOpen(true);
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

  const handleReinitializePassword = () => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      btn: {
        close: 'CANCELAR',
        confirm: 'ACEPTAR',
      },
      onConfirm: () => {
        onReinitializePassword();
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de reiniciar su contraseña?',
      dlgSettings
    );
  }

  const onReinitializePassword = async() => {
    try {
      blockUI.current.open(true);
      userService.getAccessToken();
      await userService.reinitializerPasswordCustomer({id: dataUser.uid});
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

  useEffect(() => {
    if (dni) {
      const dataSearch = {
        type: "1", 
        dato: dni
      }
      setInitialValues(dataSearch)
      onSubmit(dataSearch)
    }
  }, [dni]);

  return (
    <div className={`gift-card animate__animated animate__fadeInUp ${modalStyle.wrapperSearchCustomer}`}>
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
                          <MenuItem value={"1"}>DNI</MenuItem>
                          <MenuItem value={"2"} ># GIFT CARD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        id="dato"
                        name="dato"
                        autoComplete="dato"
                        autoFocus={(!open) ? true : false}
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
                        onInput={(event)=>{
                          const scannedText = event.target.value;
                          if (scannedText.length >= 10) {
                            handleSubmit();
                          }
                        }}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={1} style={{paddingTop: '9px'}}>
                      <IconButton 
                        color="primary" 
                        component="label"
                        onClick={()=>{handleSubmit()}}
                      >
                        <Tooltip title="Buscar / Reload" placement="right">
                          <YoutubeSearchedForIcon />
                        </Tooltip>
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
        <Grid item xs={3}></Grid>
          {
            (dataUser.uid)
              &&
                <Grid item xs={6} className={modalStyle.wrapperInfoGiftcard}>
                  <Grid container>
                    <Grid item xs={4} style={{paddingTop: '8px'}}>{dataUser?.name}</Grid>
                    <Grid item xs={4} style={{paddingTop: '8px'}}>{`TOTAL: ${giftCards?.length}`}</Grid>
                    <Grid item xs={4}>
                      <IconButton
                        aria-label="delete" 
                        color="primary" 
                        onClick={()=>{handleReinitializePassword()}}
                      >
                        <Tooltip title="Reiniciar contraseña a DNI" placement="top">
                          <LockClockIcon style={{color:'red'}}/>
                        </Tooltip>
                      </IconButton>
                    </Grid>
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

                <Button 
                  variant="contained" 
                  color="primary"
                  style={{marginLeft: '20px', width: '150px', backgroundColor: 'red'}}
                  onClick={()=>{
                    setIdCustomerPaperBin(dataUser.uid);
                    setOpenPaperBin(true);
                  }}>
                  PAPELERA
                </Button>
              </Grid>
        }
        {
          (open)
            &&
              <CreateGiftcard
                open={open}
                setOpen={setOpen}
                dataCard={giftCardReview}
                dataUser={dataUser}
                giftCards={giftCards}
                setGiftCards={setGiftCards}
              />
        }
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
                        <Grid item xs={2}>
                          <IconButton
                            component="label"
                            onClick={()=>{handleViewShopping(e.uid)}}
                            size="large"
                            style={{color:'orange'}}
                          >
                            <Tooltip title="VER COMPRAS" placement="top">
                              <SellIcon/>
                            </Tooltip>
                          </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            component="label"
                            onClick={()=>{handleActiveLost(e)}}
                            size="large"
                            style={{color:'red'}}
                          >
                            <Tooltip title="MARCAR COMO PERDIDO" placement="top">
                              <CreditCardOffIcon/>
                            </Tooltip>
                          </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton 
                            color="primary" 
                            component="label"
                            onClick={()=>{handleSenCard(e)}}
                            size="large"
                            style={{color:'green'}}
                          >
                            <Tooltip title="ENVIAR PÁGINA" placement="top">
                              <QuestionAnswerIcon/>
                            </Tooltip>
                          </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton 
                            color="primary" 
                            component="label"
                            onClick={()=>{handleEditGiftcard(e)}}
                            size="large"
                            style={{color:'orange'}}
                            disabled={state.user.role === 'EMPLOYEE_ROLE' || state.user.role === 'PARTNER_ROLE'}
                          >
                            <Tooltip title="EDITAR" placement="top">
                              <EditIcon/>
                            </Tooltip>
                          </IconButton>
                        </Grid>
                        {/* <Grid item xs={2}>
                          {
                            (e.statusLost) 
                              ? <Brightness1Icon style={{color:'red', marginTop: '12px'}}/>
                              : <Brightness1Icon style={{color:'#18af18', marginTop: '12px'}}/>
                          }
                        </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid item xs={1} className='card2 animate__animated animate__rotateInDownRight'>
                      
                        <IconButton 
                          color="primary" 
                          component="label"
                          onClick={()=>{
                            handleBuy(e)
                          }}
                          size="large"
                        >
                          <Tooltip title="COMPRAR" placement="right">
                            <PaidIcon/>
                          </Tooltip>
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <article className="gift-card animate__animated animate__rotateInDownLeft" style={(e.statusLost) ? {backgroundColor: 'red', color: 'white'} : {}}>
                        <div className="gift-card__image">
                        </div>
                        <section className="gift-card__content">
                          <div className="gift-card__amount">S/.{e.amountAvailable}</div>
                          <div className="gift-card__amount-remaining">Monto Inicial: S/{e.amount}</div>    
                          <div className="gift-card__code">{e.code}</div>
                          <div className="gift-card__msg">Código de Identificación</div>
                          <div className="gift-card__msg">CREADO POR: {e.creator.name}</div>
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
              newRequest={newRequest}
            />
      }

      {
        (openPaperBin)
          &&
            <PaperBinGiftcard
              openPaperBin={openPaperBin}
              setOpenPaperBin={setOpenPaperBin}
              idCustomer={idCustomerPaperBin}
            />
      }

    </div>
  )
}

export default ListGiftcard;
