import moment from "moment";
import { useState, useContext } from "react";
import CommentTextBox from "../../common/RichTextBox";
import { Paper, Box, Avatar, Typography, IconButton } from "@mui/material";
import Iconify from "@/components/common/Iconify";

import { deleteComment } from "@/redux/actions/user/blogActions";
import StoreHooks from "@/redux/contextProvider/storeHooks";
import AlertDialog from "@/components/common/AlertDialog";

const Comment = ({ comment, isMyComment, fetchData }) => {
  const storeHooks = useContext(StoreHooks);

  // ==== ALERT ====
  const [action, setAction] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    setSelectedData([]);
  };

  const dialogAction = async () => {
    if (action === "DELETE") {
      const res = await deleteComment(comment._id, storeHooks);
      if (res.status == 200) {
        fetchData();
      }
    }
  };

  const handleDeleteComment = async () => {
    const res = await deleteComment(comment._id, storeHooks);
  };
  return (
    <>
      <Paper
        key={comment._id}
        sx={{
          p: 2,
          pb: 4,
          mt: 2,
          borderRadius: 2,
          border: "2px solid rgba(7, 7, 7, 1)",
          borderRadius: "30px",
          boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={comment?.author?.image} />
            <Typography variant="body1">{comment?.author?.name}</Typography>
            <Typography variant="body2">
              • {moment(comment.createdAt).fromNow()}
            </Typography>
          </Box>
          {isMyComment && (
            <Box>
              <IconButton>
                <Iconify icon="mdi:edit" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setOpenAlertDialog(true);
                  setAction("DELETE");
                  setAlertTitle("Delete Comment");
                  setAlertMessage(
                    "Are you sure you want to delete this comment?"
                  );
                  setSelectedData([comment._id]);
                }}
              >
                <Iconify icon="mdi:delete" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography key={comment._id} variant="body1">
          <CommentTextBox
            value={comment.content}
            setValue={() => {}}
            readOnly={true}
          />
        </Typography>
      </Paper>
      <AlertDialog
        openDialog={openAlertDialog}
        handleCloseDialog={handleCloseAlertDialog}
        alertTitle={alertTitle}
        alertMessage={alertMessage}
        dialogAction={dialogAction}
      />
    </>
  );
};

export default Comment;
