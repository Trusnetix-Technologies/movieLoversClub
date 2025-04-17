import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Paper, Grid, TextField, Button } from "@mui/material";

// ==== IMPORT ACTIONS ====
import { sendOtp, verifyOtp } from "@/redux/actions/authActions";

// ==== IMPORT REDUX ====
import { fetchCurrentUser } from "@/redux/reducers/authReducer";

const Login = () => {
  const dispatch = useDispatch();
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
      dispatch(fetchCurrentUser());
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
            src="/images/login.gif"
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
