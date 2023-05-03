import React, { useState, useEffect } from 'react';
import { Grid, Modal } from '@mui/material';
import 'animate.css';
import _ from 'lodash';
import { ModalCustomStyles } from '../../assets/css';
import { GiftCardService } from '../../services';
import { useUI } from '../../app/context/ui';
import { GiftCardCustomerPublicStyles } from '../dashboardPublic/styles/giftcard-public-style';
import dateFormat from 'dateformat';

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
    idGiftcardShopping
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
  
  useEffect(() => {
    if(idGiftcardShopping){
      (async function init() {
        await getListQrs();
      })();
    }
  }, [idGiftcardShopping]);

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
                        (ticket.status) ? 'DISPONIBLE' : 'ESCANEADO'
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
