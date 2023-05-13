import React, { useState, useEffect } from 'react';
import store from '../../redux/store';
import { useHistory, useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { GiftCardService } from '../../services';
import { Typography } from '@mui/material';

const giftCardService = new GiftCardService();

const ManagerTickets = (props) => {
  
  const location = useLocation();
  const { blockUI } = useUI();
  const state = store.getState();
  const history = useHistory();
  const [approvedQr, setApprovedQr] = useState(false);
  const [messageApproveQr, setMessageApproveQr] = useState('');
  const isMobile = /mobile|android/i.test(navigator.userAgent);
  const [requestFailedGiftcard, setRequestFailedGiftcard] = useState(false);
  const [hasError, setHasError] = useState({});


  const accessToken = state.user.accessToken;
  if (!accessToken) {
    history.push("/login");
  }

  const id = location.pathname.split('/tickets/')[1];

  const getVerifyQr = async () => {
    try {
      console.log('ejecutando');
      blockUI.current.open(true);
      giftCardService.getAccessToken();
      const resp = await giftCardService.verifyQr({id});
      setApprovedQr(true);
      setMessageApproveQr(resp.data.message);
      blockUI.current.open(false);
    } catch (e) {
      setRequestFailedGiftcard(true);
      setHasError({message: e.response.data.message})
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getVerifyQr();
    })();
  }, [id]);

  // useEffect(() => {
  //   const delayTask = setTimeout(() => {
  //     if(id){
  //       history.push("/dashboard");
  //     }
  //   }, 10000);

  //   return () => {
  //     clearTimeout(delayTask);
  //   };
  // }, []);

  return (
    <div>
      {
        (isMobile)
          &&
            <div style={{marginTop: '73px'}}>
              <div style={{textAlign:'center', paddingTop: '30px'}}>
                VERIFICADOR DE QR
              </div>
              <Typography component="div">
                {requestFailedGiftcard && (
                  <p style={{textAlign: 'center', padding: '30px', backgroundColor:'#bd1515', color:'white', borderRadius:'15px', marginTop:'20px'}} align="center">{hasError.message}</p>
                )}
              </Typography>
              {
                (approvedQr)
                  &&
                    <div style={{textAlign: 'center', padding: '30px', backgroundColor:'#0b612e', color:'white', borderRadius:'15px', marginTop:'16px'}}>
                      { messageApproveQr }
                    </div>
              }
            </div>
      }
    </div>
  )
}

export default ManagerTickets;
