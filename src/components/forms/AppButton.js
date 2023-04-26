import React from 'react';
import { Button } from '@mui/material';
import {AppStyle} from '../../assets/css/app/AppStyle';

const AppButton = props => {
  const appStyle = AppStyle();
  const {onPress, label, type, color, disabled, background} =  props;

  return (
    <Button
      variant="contained"
      color={color !== undefined ? color : 'default'}
      className={type === 'main' ? appStyle.txtBold : ''}
      fullWidth={type === 'main'}
      disabled={disabled}
      onClick={onPress}
      style={background === 'blue' ? {backgroundColor: '#01019d'} : {backgroundColor: '#c90000'}}
    >
      {label}
    </Button>
  );
};

export default AppButton;
