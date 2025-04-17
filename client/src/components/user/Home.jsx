import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Container } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import AppBar from "./AppBar";
import BlogPost from "./blog/BlogPost";
import SearchBox from "./SearchBox";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { getBlogPosts } from "@/redux/actions/user/blogActions";
import { fetchMyLikes } from "@/redux/reducers/user/likesReducer";
import {
  fetchBlogPosts,
  selectBlogPosts,
} from "@/redux/reducers/user/blogPostReducer";

const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

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
    <Box
      sx={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        background: "#08351D",
        position: "relative",

        // background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`,
          backgroundImage: `url("/images/noise 2.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        },
      }}
    >
      <Container
        sx={{
          position: "relative",
          pt: 2,
          zIndex: 10,
        }}
      >
        <AppBar />
        <Box height={90} />
        <Typography
          variant="h1"
          textAlign="center"
          sx={{
            color: "rgba(221, 253, 172, 1)",
            whiteSpace: "pre-line",
          }}
          mb={5}
        >
          {"Explore, Discuss, and Discover\n the World of Movies"}
        </Typography>
        <SearchBox />

        <Box
          p={3}
          mt={5}
          sx={{
            background: "rgba(239, 238, 187, 1)",
            borderRadius: "42px",
            border: "2px solid rgba(7, 7, 7, 1)",
            boxShadow: "0px 4px 0px 0px rgba(7, 7, 7, 1)",
          }}
        >
          {blogPosts.loading == "loaded" &&
          blogPosts?.blogPosts?.length === 0 ? (
            <Typography variant="h6" textAlign="center">
              No posts found
            </Typography>
          ) : (
            <Typography variant="h4" fontWeight="bold" mb={2} mt={1}>
              BLOG POSTS FOR YOU
            </Typography>
          )}
          {blogPosts?.blogPosts?.map((post) => (
            <BlogPost key={post._id} post={post} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
