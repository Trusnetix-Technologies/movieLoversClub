import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, useTheme } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import AppBar from "@/components/user/AppBar";
import BlogPost from "@/components/user/blog/BlogPost";

// ==== IMPORT PROVIDER ====
import { useDispatch, useSelector } from "react-redux";
import { getBlogPostById } from "@/redux/actions/user/blogActions";
import { fetchMyLikes } from "@/redux/reducers/user/likesReducer";

const Blog = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  // ==== QUERY PARAMS ====
  const { id } = router.query;

  // ==== STATE ====
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * Fetch the individual blog post using the id provided in the url
   * Extracted the id from the url using router.query
   * Passed the id to the getBlogPostById action
   * Set the data to the state
   * Set the isLoading to false
   */
  const fetchData = async () => {
    setIsLoading(true);
    const res = await getBlogPostById(id);
    console.log("==== RES ==== \n res:", res);
    if (res.status === 200) {
      setData(res.data);
      setIsLoading(false);
    }
  };

  /*
   * On component mount, fetch the my likes
   */
  useEffect(() => {
    dispatch(fetchMyLikes());
    fetchData();
  }, [id]);

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

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: "100vh",
              width: "100%",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Box mt={6}>
            <BlogPost post={data} fetchData={fetchData} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blog;
