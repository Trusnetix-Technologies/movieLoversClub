import { Button } from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "20px",

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
