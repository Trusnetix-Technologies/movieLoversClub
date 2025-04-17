import "@/styles/globals.css";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

// ==== IMPORT THEME PROVIDERS ====
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/styles/mui/theme";
import StoreHooks from "@/redux/contextProvider/storeHooks";

import SnackBar from "@/components/common/SnackBar";

// ==== IMPORT REDUX ====
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }) {
  // ==== SNACKBAR STATES ====
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [snackBarType, setSnackBarType] = useState("success"); // "success", "warning", "error"
  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };
  const handleOpenSnackBar = (msg, type) => {
    console.log(msg);
    setSnackBarMsg(msg);
    setSnackBarType(type);
    setOpenSnackBar(true);
  };
  // =====================
  return (
    <Provider store={store}>
      <StoreHooks.Provider value={{ handleOpenSnackBar }}>
        <ThemeProvider theme={lightTheme}>
          <Component {...pageProps} />
          <SnackBar
            openSnackBar={openSnackBar}
            handleCloseSnackBar={handleCloseSnackBar}
            snackBarMsg={snackBarMsg}
            snackBarType={snackBarType}
          />
        </ThemeProvider>
      </StoreHooks.Provider>
    </Provider>
  );
}
