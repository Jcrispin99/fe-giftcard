import { makeStyles } from "@mui/styles";

export const GiftCardCustomerPublicStyles = makeStyles((theme) => ({
  wrapperImg: {
    textAlign: 'center',
    marginTop: '30px',
    '& .imgPending': {
      borderRadius: '30px',
      width: '17%'
    }
  },
}));