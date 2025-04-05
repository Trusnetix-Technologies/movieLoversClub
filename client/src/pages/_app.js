import "@/styles/globals.css";

// ==== IMPORT THEME PROVIDERS ====
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/styles/mui/theme";

// ==== IMPORT REDUX ====
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
