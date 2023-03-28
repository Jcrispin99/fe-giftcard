import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E8E8E8',
    },
  },
  typography: {
    fontFamily: [
      'Verdana',
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
    ].join(','),
    fontSize: 16,
    fontWeight: 400,
    style: 'normal',
    lineHeight: '21.88px'
  },
  focused: {},
  disabled: {},
  error: {},
  overrides: {
    MuiAlert: {
      standardInfo: {
        backgroundColor: "transparent"
      }
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: '1px solid #484646'
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: '1px solid #484646'
        },
        '&:focused:after': {
          borderBottom: '1px solid #484646'
        }
      },
    },
  }
});
