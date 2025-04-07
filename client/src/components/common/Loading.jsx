import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="h6">Loading...</Typography>
    </Box>
  );
};

export default Loading;
