import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";

// ==== COMPONENTS ====
import Iconify from "@/components/common/Iconify";
import {
  Box,
  Avatar,
  Paper,
  Typography,
  useTheme,
  Divider,
  Button,
  Chip,
} from "@mui/material";

// ==== COMPONENTS ====
import IconButton from "@mui/material/IconButton";
import RichTextBox from "../../common/RichTextBox";
import PaymentDialog from "../payment/PaymentDialog";
import { PrimaryButton } from "@/styles/mui/themeComponents";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLikes, selectLikes } from "@/redux/reducers/user/likesReducer";
import { likeBlogPost, addComment } from "@/redux/actions/user/blogActions";
import StoreHooks from "@/redux/contextProvider/storeHooks";
import { selectAuthData } from "@/redux/reducers/authReducer";

/*
 * Post, fetchData, showLess are props passed from the parent component
 */
const BlogPost = ({ post, fetchData, showLess }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const storeHooks = useContext(StoreHooks);

  // ===+ SELECTORS ====
  const likes = useSelector(selectLikes);
  const auth = useSelector(selectAuthData);

  // ==== STATE ====
  const [myComment, setMyComment] = useState(""); // to write new comment

  /*
   * handleLike is used to like a blog post
   * It takes the blog id from the post and passes it to the likeBlogPost action
   * If the like is successful, it fetches the my likes and the blog posts
   */
  const handleLike = async () => {
    const values = {
      blogId: post._id,
    };
    const res = await likeBlogPost(values);
    if (res.status === 200) {
      dispatch(fetchMyLikes());
      fetchData();
    }
  };

  /*
   * maxLength is the maximum length of the blog post content
   * It is used to show the read more button
   */
  const maxLength = 600;

  /*
   * handleAddComment is used to add a comment to a blog post
   */
  const handleAddComment = async () => {
    const values = {
      blogId: post._id,
      content: myComment,
    };
    const res = await addComment(values, storeHooks);
    if (res.status === 200) {
      setMyComment("");
      fetchData();
    }
  };

  const isLoggedIn = auth.loading == "loaded" && auth.authData != "error";
  const isProUser = auth.loading == "loaded" && auth.authData.plan == "PRO";

  /*
   * Payment dialog
   */
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handlePaymentDialogOpen = () => {
    setPaymentDialogOpen(true);
  };

  const handlePaymentDialogClose = () => {
    setPaymentDialogOpen(false);
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          border: "2px solid rgba(7, 7, 7, 1)",
          borderRadius: "30px",
          boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
          mb: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="start" gap={2}>
            <img
              src={post.image}
              alt={post.movie}
              style={{ width: "auto", height: "180px", borderRadius: "5px" }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {post.movie}
              </Typography>
              {post.rating && (
                <Typography
                  mt={1}
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Iconify
                    icon="material-symbols:star-rounded"
                    sx={{
                      color: "#FFB641",
                    }}
                  />
                  {post.rating}
                </Typography>
              )}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                {post.genre &&
                  post.genre.split(",").map((genre) => (
                    <Chip
                      label={genre}
                      key={genre}
                      sx={{
                        backgroundColor: "#0074D2",
                        color: "white",
                      }}
                    />
                  ))}
              </Box>
              <Typography variant="body1">{post.director}</Typography>
              <Typography variant="body1">Overview</Typography>
              <Typography variant="caption">{post.description}</Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {post.title}
        </Typography>
        <Typography variant="body1" mb={2}>
          <Box
            sx={{
              position: "relative",
              maxHeight: "100px",
              overflow: "hidden",
              "&::after":
                showLess && post.content.length > maxLength
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "100px",
                      background: `linear-gradient(180deg, transparent, ${theme.palette.background.paper})`,
                    }
                  : {},
            }}
          >
            <RichTextBox
              value={post.content}
              readOnly={true}
              sx={{
                maxHeight: showLess ? "200px" : "none",
                overflow: showLess ? "hidden" : "visible",
              }}
            />
          </Box>
        </Typography>
        {showLess && post.content.length > maxLength && (
          <Link
            href={{
              pathname: `/blog`,
              query: { id: post._id, title: post.title },
            }}
          >
            <Typography variant="body2" color="error.main">
              Read More
            </Typography>
          </Link>
        )}
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" mt={2}>
            <IconButton onClick={handleLike}>
              <Iconify
                icon={
                  likes.likes.find((like) => like.blog === post._id)
                    ? "material-symbols:favorite"
                    : "material-symbols:favorite-outline"
                }
                sx={{
                  color: likes.likes.find((like) => like.blog === post._id)
                    ? theme.palette.error.main
                    : theme.palette.text.primary,
                }}
              />
            </IconButton>
            <Typography variant="body1">{post.likesCount ?? 0}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <IconButton
              onClick={() => {
                router.push({
                  pathname: `/blog`,
                  query: { id: post._id, title: post.title },
                });
              }}
            >
              <Iconify icon="iconamoon:comment-light" />
            </IconButton>
            <Typography variant="body1">{post.commentsCount ?? 0}</Typography>
          </Box>
        </Box>
      </Paper>
      {!showLess && (
        <Box
          p={3}
          mt={2}
          sx={{
            background: "rgba(239, 238, 187, 1)",
            borderRadius: "42px",
            border: "2px solid rgba(7, 7, 7, 1)",
            boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2} mt={1}>
            COMMENTS
          </Typography>
          {isLoggedIn && (
            <Paper
              sx={{
                p: 2,
                pb: 4,
                borderRadius: 2,
                border: "2px solid rgba(7, 7, 7, 1)",
                borderRadius: "30px",
                boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
                position: "relative",
              }}
            >
              <Box
                position="relative"
                sx={{
                  "&::before": !isProUser && {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.01)",
                    zIndex: 1,
                    backdropFilter: "blur(1px)",
                  },
                }}
              >
                <Typography variant="h6" mb={2}>
                  Add a comment
                </Typography>
                {/* ==== COMMENT TEXT BOX ==== */}
                <RichTextBox
                  value={myComment}
                  setValue={setMyComment}
                  readOnly={false}
                />
                <Box display="flex" justifyContent="flex-end">
                  <PrimaryButton
                    variant="contained"
                    color="background.darkPaper"
                    sx={{ mt: 2 }}
                    onClick={handleAddComment}
                  >
                    Add Comment
                  </PrimaryButton>
                </Box>
              </Box>
              {!isProUser && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 2,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      backgroundColor: "rgba(255, 0, 0, 1)",
                      color: theme.palette.primary.contrastText,
                      borderRadius: "20px",

                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 1)",
                      },
                    }}
                    onClick={handlePaymentDialogOpen}
                  >
                    Become Pro Member to Publish
                  </Button>
                </Box>
              )}
            </Paper>
          )}
          {/* ==== PAYMENT DIALOG ==== */}
          <PaymentDialog
            open={paymentDialogOpen}
            onClose={handlePaymentDialogClose}
          />

          <Divider sx={{ mt: 2 }} />
          {post.comments.map((comment, i) => (
            <RichTextBox
              key={comment._id}
              comment={comment}
              isMyComment={comment.author._id == auth.authData._id}
              fetchData={fetchData}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default BlogPost;
