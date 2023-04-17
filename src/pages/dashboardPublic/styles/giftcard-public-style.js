import { makeStyles } from "@mui/styles";

export const GiftCardCustomerPublicStyles = makeStyles((theme) => ({
  wrapperGiftCard: {
    padding: '24px',
    '& .failedRequest': {
      color: 'red',
      fontSize: '12px',
      textAlign: 'center',
      paddingBottom: '31px',
    }
  }
}));