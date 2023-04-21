import React, { useState, useEffect } from 'react';
import store from '../../redux/store';
import { useHistory, useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';

const ManagerTickets = (props) => {
  
  const location = useLocation();
  const { blockUI } = useUI();
  const state = store.getState();
  const history = useHistory();
  const [openAlert, setOpenAlert] = useState(false);

  const accessToken = state.user.accessToken;
  if (!accessToken) {
    history.push("/login");
  }

  const id = location.pathname.split('/tickets/')[1];

  const getVerifyQr = async () => {
    try {
      blockUI.current.open(true);
      setOpenAlert(true);
      blockUI.current.open(false);
    } catch (e) {
      blockUI.current.open(false);
    }
  };

  useEffect(() => {
    (async function init() {
      await getVerifyQr();
    })();
  }, []);

  return (
    <div>
      <div style={{textAlign:'center', paddingTop: '30px'}}>
        Manager Tickets
      </div>
      {
        (openAlert)
          &&
            <div style={{textAlign: 'center', padding: '30px', backgroundColor:'black', color:'white', borderRadius:'15px', marginTop:'20px'}}>
              APROBADO
            </div>
      }
    </div>
  )
}

export default ManagerTickets;
