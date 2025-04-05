import { Icon } from "@iconify/react";
import { Box, useTheme } from "@mui/material";

export default function Iconify({ icon, sx, width, height, ...other }) {
  const theme = useTheme();
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={{ ...sx, color: sx?.color ?? theme.palette.icon.main }}
      {...other}
    />
  );
}
