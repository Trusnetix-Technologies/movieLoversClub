import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";

// ==== IMPORT ACTIONS ====
import { onboard } from "@/redux/actions/authActions";

// ==== IMPORT REDUX ====
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/reducers/authReducer";

const Onboard = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await onboard(name);
    if (res.status == 200) {
      dispatch(fetchCurrentUser());
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Welcome!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Let's start by getting to know you
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="What's your name?"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                borderRadius: 2,
                height: 48,
              }}
            >
              Continue
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Onboard;
