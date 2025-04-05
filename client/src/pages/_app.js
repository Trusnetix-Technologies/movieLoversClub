import "@/styles/globals.css";

// ==== IMPORT THEME PROVIDERS ====
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/styles/mui/theme";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
