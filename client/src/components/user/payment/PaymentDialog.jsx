import Script from "next/script";
import { useState } from "react";
import { Cookies } from "react-cookie";

import { Box, Dialog, IconButton, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "@/styles/mui/themeComponents";

// ==== IMPORT PROVIDERS ====
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/reducers/authReducer";
import Iconify from "@/components/common/Iconify";

const PaymentDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  /*
   * Create .env.local file in client and add the NEXT_PUBLIC_RAZORPAY_KEY_ID and NEXT_PUBLIC_RAZORPAY_KEY_SECRET
   * Razorpay test card - 4111 1111 1111 1111, cvv - random 3 digits, expiry - any future date
   */

  const PRICE = 499;

  const handlePay = async (values) => {
    const cookies = new Cookies();
    const cookieData = await cookies.getAll();

    const response = await fetch("/api/v1/user/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookieData.userToken,
      },
      body: JSON.stringify({
        amount: PRICE,
      }),
    });
    const data = await response.json();
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: PRICE * 100,
      currency: "INR",
      name: "Trusnetix",
      description: "Payment for the PRO membership",
      order_id: data.orderId,
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        const orderId = response.razorpay_order_id;
        const signature = response.razorpay_signature;
        const response2 = await fetch("/api/v1/user/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookieData.userToken,
          },
          body: JSON.stringify({
            paymentId,
            orderId,
            signature,
          }),
        });
        const data2 = await response2.json();
        if (data2.success) {
          setPaymentSuccess(true);
          dispatch(fetchCurrentUser());
          onClose();
        }
      },
      prefill: {
        name: values.name,
        email: values.email,
        contact: values.phone,
      },
      theme: {
        color: theme.palette.primary.main,
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        // border radius: "20px",
        "& .MuiDialog-paper": {
          borderRadius: "20px",
        },
      }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Box
        sx={{
          p: 4,
          background: theme.palette.background.paper,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Iconify icon="mdi:close" />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Upgrade to PRO
        </Typography>

        <Box
          sx={{
            background: "rgba(239, 238, 187, 0.5)",
            borderRadius: "20px",
            p: 3,
            mb: 4,
            border: "2px solid rgba(7, 7, 7, 1)",
            boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Benefits of PRO Membership
          </Typography>

          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="body1" mb={2}>
              • Publish your own movie blog posts
            </Typography>
            <Typography variant="body1" mb={2}>
              • Engage with the community through comments
            </Typography>
            <Typography variant="body1" mb={2}>
              • Share your movie reviews and insights
            </Typography>
            <Typography variant="body1">
              • Join an exclusive community of movie enthusiasts
            </Typography>
          </Box>

          <Typography variant="h4" color="primary" fontWeight="bold">
            ₹499{" "}
            <Typography component="span" variant="body1">
              only
            </Typography>
          </Typography>
        </Box>

        <PrimaryButton
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
          }}
          onClick={handlePay}
        >
          Upgrade Now
        </PrimaryButton>
      </Box>
    </Dialog>
  );
};

export default PaymentDialog;
