import moment from "moment";
import Iconify from "@/components/common/Iconify";
import { Box, Avatar, Paper, Typography } from "@mui/material";

import IconButton from "@mui/material/IconButton";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLikes, selectLikes } from "@/redux/reducers/user/likesReducer";
import { likeBlogPost } from "@/redux/actions/user/blogActions";
import {
  fetchBlogPosts,
  selectBlogPosts,
} from "@/redux/reducers/user/blogPostReducer";
const BlogPost = ({ post, fetchBlogPosts }) => {
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
      const values = {
        page: 0,
        pageSize: 10,
      };
      dispatch(fetchBlogPosts(values));
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
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
      <Typography variant="body1">{post.content}</Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <IconButton onClick={handleLike}>
          <Iconify
            icon={
              likes.likes.find((like) => like.blog === post._id)
                ? "material-symbols:favorite"
                : "material-symbols:favorite-outline"
            }
          />
        </IconButton>
        <Typography variant="body1">{post.likesCount ?? 0}</Typography>
      </Box>
    </Paper>
  );
};

export default BlogPost;
