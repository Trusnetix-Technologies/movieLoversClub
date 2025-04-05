import * as React from "react";

// ==== IMPORT MUI ====
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBar = (props) => (
  <Snackbar
    id="snackbar"
    open={props.openSnackBar}
    autoHideDuration={3000}
    onClose={props.handleCloseSnackBar}
  >
    <Alert
      id="snackbar_alert"
      onClick={props.handleCloseSnackBar}
      severity={props.snackBarType}
    >
      {props.snackBarMsg}
    </Alert>
  </Snackbar>
);

export default SnackBar;
