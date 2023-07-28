import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material';
import 'animate.css';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { GiftCardCustomerPublicStyles } from '../dashboardPublic/styles/giftcard-public-style';
import MyShopping from '../buy/MyShopping';
import SellIcon from '@mui/icons-material/Sell';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import store from '../../redux/store';
import { useUI } from '../../app/context/ui';
import { GiftCardService } from '../../services';

const giftCardService = new GiftCardService();

const PaperBinGiftcard = (props) => {

  const { 
    openPaperBin, 
    setOpenPaperBin,
    idCustomer,
  } = props;

  const modalStyle = ModalCustomStyles();
  const { blockUI } = useUI();
  const [idGiftcardShopping, setIdGiftcardShopping] = useState();
  const [newRequest, setNewRequest] = useState('');
  const [openShopping, setOpenShopping] = useState(false);
  const [giftCards, setGiftCards] = useState([]);

  const handleViewShopping = (gifcard) => {
    setIdGiftcardShopping(gifcard);
    setNewRequest(uuidv4());
    setOpenShopping(true);
  }

  const getListGiftcards = async() => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      const r2 = await giftCardService.mygiftcardsPaperBin(`user_id=${idCustomer}`);
      setGiftCards(r2.data.giftcard);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getListGiftcards();
    })();
  }, []);

  return (
    <Modal
      open={openPaperBin}
      onClose={() => setOpenPaperBin(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEscapeKeyDown={true}
      className="animate__animated animate__backInLeft"
    >
      <div className={modalStyle.paperModal} style={{width: 1300,}}>
        <Typography className="title">PAPELERA GIFT CARD</Typography>
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
                              // onClick={()=>{handleActiveLost(e)}}
                              size="large"
                              style={{color:'red'}}
                              disabled={true}
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
                              // onClick={()=>{handleSenCard(e)}}
                              disabled={true}
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
                              // onClick={()=>{handleEditGiftcard(e)}}
                              size="large"
                              style={{color:'orange'}}
                              disabled={true}
                            >
                              <Tooltip title="EDITAR" placement="top">
                                <EditIcon/>
                              </Tooltip>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1} className='card2 animate__animated animate__rotateInDownRight'>
                          <IconButton 
                            color="primary" 
                            component="label"
                            // onClick={()=>{
                            //   handleBuy(e)
                            // }}
                            disabled={true}
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
      </div>

      {/* {
        (idGiftcardShopping)
          &&
            <MyShopping
              openShopping={openShopping}
              setOpenShopping={setOpenShopping}
              idGiftcardShopping={idGiftcardShopping}
              newRequest={newRequest}
            />
      } */}
      
    </Modal>
  )
}

export default PaperBinGiftcard;
