import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Modal, Tooltip } from '@mui/material';
import 'animate.css';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { GiftCardService } from '../../services';
import { useUI } from '../../app/context/ui';
import { GiftCardCustomerPublicStyles } from '../dashboardPublic/styles/giftcard-public-style';
import dateFormat from 'dateformat';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

let dlgSettings = {
  confirm: false,
  btn: {
    close: 'Cerrar',
  },
  onConfirm: () => {},
};

const giftCardService = new GiftCardService();

const MyShopping = (props) => {

  const { 
    openShopping, 
    setOpenShopping, 
    idGiftcardShopping,
    newRequest,
  } = props;

  const { blockUI, dialogUI } = useUI();
  const modalStyle = ModalCustomStyles();
  const giftStyle = GiftCardCustomerPublicStyles();
  const [tickets, setTickets] = useState([]);

  const getListQrs = async () => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      const mytickets = await giftCardService.mytickets(`giftcard=${idGiftcardShopping}`);
      setTickets(mytickets.data.giftcard);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const onHandleDeleteQr = async (ticket) => {
    try {
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      await giftCardService.deleteQr(ticket);
      dlgSettings = {
        ...dlgSettings,
        confirm: false,
        btn: {
          close: 'Cerrar',
        },
      };
      setOpenShopping(false);
      dialogUI.current.open('', '', dlgSettings, 'Eliminado correctamente');
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  const handleDeleteQr = (ticket) => {
    dlgSettings = {
      ...dlgSettings,
      confirm: true,
      onConfirm: () => {
        onHandleDeleteQr(ticket);
      },
    };
    dialogUI.current.open(
      'Espera!',
      'Estás seguro de eliminar el QR?',
      dlgSettings
    );
  }
  
  useEffect(() => {
    if(idGiftcardShopping){
      (async function init() {
        await getListQrs();
      })();
    }
  }, [newRequest]);

  return (
    <Modal
      open={openShopping}
      onClose={() => setOpenShopping(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEscapeKeyDown={true}
      className="animate__animated animate__backInLeft"
    >
      <div className={modalStyle.paperModal} style={{width: '700px',height: '707px',overflowY: 'scroll'}}>
        <Grid container>
          {
            (tickets.length>0)
              &&
                tickets.map((ticket, index)=>(
                  <Grid key={`ticket${index}`} item xs={3} style={{textAlign:'center', marginTop: '20px'}}>
                    <div className={giftStyle.wrapperQr} style={(ticket.status) ? {borderColor:'green'} : {borderColor:'red'}}>
                      <img src={ticket.qrImage} style={{width: '100%'}}/>
                      <div className='partner'>
                        {ticket.partner?.name}
                      </div>
                      <div className='amount'>
                        S/{ticket.amount}
                      </div>
                      <div 
                        className='status'
                        style={(ticket.status) ? {color:'green'} : {color:'red'}}
                      >
                      {
                        (ticket.status) ? 'DISPONIBLE' : 'CANJEADO'
                      }
                      </div>
                      <div style={{
                        fontSize: '11px',
                        backgroundColor: '#7a7a7a',
                        color: 'white',
                        marginTop: '7px',
                        padding: '2px',
                      }}>
                        {
                          dateFormat(new Date(ticket.createdAt), "dd-mm-yy HH:MM")
                        }
                      </div>

                      {
                        (!ticket.status)
                          &&
                            <div style={{
                              fontSize: '11px',
                              backgroundColor: 'rgb(196 35 35)',
                              color: 'white',
                              marginTop: '7px',
                              padding: '2px',
                            }}>
                              { ticket.authorizer?.name || 'CAJA' }
                            </div>

                      }

                      {/* <div>
                        <IconButton
                          color="primary" 
                          component="label"
                          onClick={()=>{handleDeleteQr(ticket)}}
                        >
                          <Tooltip title="Eliminar QR" placement="bottom">
                            <DeleteForeverIcon style={{color: 'red'}}/>
                          </Tooltip>
                        </IconButton>
                      </div> */}

                    </div>
                  </Grid>
            ))
          }
        </Grid>
        {
          (tickets.length === 0)
            &&
              <div className={giftStyle.wrapperNotTickets}>
                ----- No hay tickets -----
              </div>
        }
      </div>
    </Modal>
  )
}

export default MyShopping;
