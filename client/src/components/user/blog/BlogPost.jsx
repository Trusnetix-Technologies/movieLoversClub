import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import Iconify from "@/components/common/Iconify";
import { Box, Avatar, Paper, Typography, useTheme } from "@mui/material";

import IconButton from "@mui/material/IconButton";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLikes, selectLikes } from "@/redux/reducers/user/likesReducer";
import { likeBlogPost } from "@/redux/actions/user/blogActions";
import {
  fetchBlogPosts,
  selectBlogPosts,
} from "@/redux/reducers/user/blogPostReducer";
const BlogPost = ({ post, fetchData, showLess }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const likes = useSelector(selectLikes);

  console.log("==== LIKES ==== \n likes:", likes);

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

  const maxLength = 600;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: "2px solid rgba(7, 7, 7, 1)",
        borderRadius: "30px",
        boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={post.image} />
          <Typography variant="h6">{post.movie}</Typography>
        </Box>
        <Typography variant="body1">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </Box>
      <Typography variant="body1" mb={2}>
        {showLess ? post.content.slice(0, maxLength) + "..." : post.content}
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
  );
};

export default BlogPost;
