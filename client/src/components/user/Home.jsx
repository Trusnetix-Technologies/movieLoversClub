import { useEffect, useState } from "react";
import { Box } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import AppBar from "./AppBar";
import BlogPost from "./blog/BlogPost";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { getBlogPosts } from "@/redux/actions/user/blogActions";
import { fetchMyLikes } from "@/redux/reducers/user/likesReducer";
import {
  fetchBlogPosts,
  selectBlogPosts,
} from "@/redux/reducers/user/blogPostReducer";

const Home = () => {
  const dispatch = useDispatch();
  //   const [blogPosts, setBlogPosts] = useState([]);

  //   const fetchBlogPosts = async () => {
  //     const values = {
  //       page: 0,
  //       pageSize: 10,
  //     };
  //     const res = await getBlogPosts(values);
  //     setBlogPosts(res.data);
  //     console.log("==== BLOG POSTS ==== \n res:", res.data);
  //   };

  useEffect(() => {
    const values = {
      page: 0,
      pageSize: 10,
    };
    dispatch(fetchBlogPosts(values));
    dispatch(fetchMyLikes());
  }, []);

  const blogPosts = useSelector(selectBlogPosts);
  console.log("==== BLOG POSTS DATA ==== \n blogPostsData:", blogPosts);

  return (
    <Box>
      <AppBar />
      <Box height={90} />
      <Box p={2}>
        {blogPosts?.blogPosts?.map((post) => (
          <BlogPost key={post._id} post={post} />
        ))}
      </Box>
    </Box>
  );
};

export default Home;
