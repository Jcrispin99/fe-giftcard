import React from 'react'
import ListTicket from '../tickets/ListTicket';
import { Box } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const ListPartnerDetail = () => {

  const location = useLocation();
  const history = useHistory();

  return (
    <div>
        <Box>
            <h1 style={{textAlign: 'center', fontSize: '20px', paddingTop: '20px'}}>DEUDAS DE {location.state?.name}</h1>
        </Box>
        <ListTicket type='detail-partner' idPartnerDetail={location.state?.id}/>
    </div>
  )
}

export default ListPartnerDetail;
