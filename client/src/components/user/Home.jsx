import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// ==== IMPORT MUI ====
import {
  Box,
  Typography,
  useTheme,
  Container,
  Paper,
  Button,
} from "@mui/material";

// ==== IMPORT COMPONENTS ====
import AppBar from "./AppBar";
import SearchBox from "./SearchBox";
import BlogPost from "./blog/BlogPost";
import RichTextBox from "../common/RichTextBox";
import PaymentDialog from "./payment/PaymentDialog";
import { PrimaryButton } from "@/styles/mui/themeComponents";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLikes } from "@/redux/reducers/user/likesReducer";
import {
  fetchBlogPosts,
  selectBlogPosts,
} from "@/redux/reducers/user/blogPostReducer";
import { selectAuthData } from "@/redux/reducers/authReducer";
const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuthData);

  /*
   * On component mount, fetch the blog posts and the my likes
   * fetchBlogPost requires page and pageSize as parameters
   */
  useEffect(() => {
    const values = {
      page: 0,
      pageSize: 10,
    };
    dispatch(fetchBlogPosts(values));
    dispatch(fetchMyLikes());
  }, []);

  const fetchData = () => {
    const values = {
      page: 0,
      pageSize: 10,
    };
    dispatch(fetchBlogPosts(values));
  };

  const blogPosts = useSelector(selectBlogPosts);

  /*
   * if user is logged in and not onboarded, redirect to onboarding page
   */
  useEffect(() => {
    if (auth.loading == "loaded" && auth.authData.isOnboarded == false) {
      router.push("/onboard");
    }
  }, [auth.loading]);

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
    <Box
      sx={{
        // setting the background noise image and background color
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        background: "#08351D",
        position: "relative",

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
          // by default, the container maxWidth is lg
          // and it will appear in the center of the page
          position: "relative",
          pt: 2,
          zIndex: 10,
        }}
      >
        {/* ==== APP BAR ==== */}
        <AppBar />

        {/* ==== HEADER ==== */}
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

        {/* ==== SEARCH BOX ==== */}
        <SearchBox />

        {/* ==== BLOG POSTS ==== */}
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

          {/* ==== WRITE A BLOG POST ==== */}
          {isLoggedIn && (
            <Paper
              sx={{
                p: 2,
                pb: 4,
                mb: 3,
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
                  Write a blog post
                </Typography>
                <RichTextBox />
                <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                  <PrimaryButton
                    variant="contained"
                    color="background.darkPaper"
                  >
                    Publish
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

          {/* ==== BLOG POSTS ==== */}
          {blogPosts?.blogPosts?.map((post) => (
            <BlogPost
              key={post._id}
              post={post}
              fetchData={fetchData}
              showLess={true}
            />
          ))}
        </Box>
      </Container>
      {/* ==== PAYMENT DIALOG ==== */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={handlePaymentDialogClose}
      />
    </Box>
  );
};

export default Home;
