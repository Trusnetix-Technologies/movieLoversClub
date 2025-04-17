import { useEffect, useState } from "react";
import { Box, Container, useTheme } from "@mui/material";
import { useRouter } from "next/router";

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
  const { id } = router.query;
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getBlogPostById(id);
    console.log("==== RES ==== \n res:", res);
    if (res.status === 200) {
      setData(res.data);
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <BlogPost post={data} fetchData={fetchData} />
            </div>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Blog;
