import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

// ==== IMPORT PROVIDERS ====
import StoreHooks from "@/redux/contextProvider/storeHooks";

// ==== IMPORT ACTIONS ====
import Loading from "@/components/common/Loading";
import {
  getBlogPostById,
  updateBlogPost,
  addBlogPost,
} from "@/redux/actions/blogActions";

const BlogForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const storeHooks = useContext(StoreHooks);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBlogPostById = async () => {
    setLoading(true);
    const res = await getBlogPostById(id, storeHooks);
    if (res.status == 200) {
      setBlog(res.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchBlogPostById();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (id) {
      const res = await updateBlogPost(blog, storeHooks);
      if (res.status == 200) {
        router.push("/admin/blog");
      }
    } else {
      const res = await addBlogPost(blog, storeHooks);
      if (res.status == 200) {
        router.push("/admin/blog");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" mt={2} mb={2}>
          {id ? "Edit Blog Post" : "Add Blog Post"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            value={blog?.title}
            onChange={(e) => {
              setBlog({ ...blog, title: e.target.value });
            }}
          />
          <TextField
            label="Content"
            multiline
            rows={4}
            value={blog?.content}
            onChange={(e) => {
              setBlog({ ...blog, content: e.target.value });
            }}
          />
          <TextField
            label="Movie"
            value={blog?.movie}
            onChange={(e) => {
              setBlog({ ...blog, movie: e.target.value });
            }}
          />
          <TextField
            label="Director"
            value={blog?.director}
            onChange={(e) => {
              setBlog({ ...blog, director: e.target.value });
            }}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogForm;
