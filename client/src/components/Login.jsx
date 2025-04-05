import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, TextField, Button } from "@mui/material";

// ==== IMPORT ACTIONS ====
import { sendOtp, verifyOtp } from "@/redux/actions/authActions";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendOtp = async () => {
    if (!phone) {
      setErrors({ phone: "Phone number is required" });
      return;
    }
    if (phone.length !== 10) {
      setErrors({ phone: "Phone number must be 10 digits" });
      return;
    }
    const response = await sendOtp(phone);
    if (response.status === 200) {
      setShowOtp(true);
    } else {
      setErrors({ phone: "Failed to send OTP" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }
    const response = await verifyOtp(phone, otp);
    if (response.status === 200) {
      // dispatch fetch user
    } else {
      setErrors({ otp: "Failed to verify OTP" });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          size={{ xs: 12, md: 6 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {/* ==== IMAGE CONTAINER ==== */}
          <Box
            component="img"
            src="https://s3-alpha-sig.figma.com/img/ace0/7d3d/47ebb2b16c3112f80b17c7a756e7c77d?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZwN78RxGUPtVFYEpVq8SaysKJGJJW7QVKz1tJrHZKw~vGb4PuWql6zPezJCBTiezO6juKKJClBNCcAg29T4SEe~a0ouZ0Hl6NVM3mIHKK56EgyyIzzDJbpUJ99SuQtZwdewyG34ms86a~zL15isPNVM22w3KguMpx7d8CvU3ReaA-ehyZ3BPXsMjiLW2xL-A81oQ9OYK92k-gY3kwFObOkhQB-FVYXoJB2xMh5b1dxbC2wQGjY34HJevoMMtthKP2AUxVhg4drfFgDFZKyou4a-IrjERXC2axnqtBGkL9BACTxQJuS4sLChZcl~ozXXLEQnzdZzUSOA59J5Vsryd8w__"
            alt="login-image"
            width="100%"
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" mb={2} textAlign="center">
              SIGN IN To Spoiler Alert
            </Typography>
            {showOtp ? (
              <TextField
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                label="OTP"
                fullWidth
                placeholder="Enter OTP"
                error={!!errors.otp}
                helperText={errors.otp}
              />
            ) : (
              <TextField
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                label="Phone Number"
                fullWidth
                placeholder="Enter Phone Number"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            )}
            <Box height={10} />
            <Button
              variant="contained"
              color="primary"
              mt={2}
              onClick={showOtp ? handleVerifyOtp : handleSendOtp}
              fullWidth
            >
              Continue
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Login;
