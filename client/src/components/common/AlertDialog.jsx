import * as React from "react";
// ==== IMPORT MUI ====
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Typography } from "@mui/material";

const AlertDialog = (props) => (
  <Dialog
    id="alert_dialog"
    open={props.openDialog}
    onClose={props.handleCloseDialog}
    aria-labelledby="form-dialog-title"
  >
    <DialogContent id="alert_dialog_content">
      <Typography variant="h5" mt={1} mb={2}>
        {props.alertTitle}
      </Typography>
      <Box height={10} />
      <Typography
        variant="subtitle1"
        sx={{
          whiteSpace: "pre-line",
        }}
      >
        {props.alertMessage}
      </Typography>
    </DialogContent>
    <DialogActions id="alert_dialog_actions">
      {props.customDialogAction ? (
        props.customDialogAction
      ) : props.dialogAction ? (
        <>
          <Button
            id="alert_dialog_actions_button_1"
            className="blue-button-outlined"
            onClick={() => props.handleCloseDialog()}
          >
            Cancel
          </Button>
          <Button
            id="alert_dialog_actions_button_2"
            variant="contained"
            onClick={() => {
              props.dialogAction(), props.handleCloseDialog();
            }}
          >
            Confirm
          </Button>
        </>
      ) : (
        <Button
          id="alert_dialog_actions_button_3"
          onClick={() => props.handleCloseDialog()}
        >
          Close
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default AlertDialog;
