import { useState, useEffect, useContext } from "react";
import { Typography, TextField, Box, Autocomplete } from "@mui/material";
import RichTextBox from "@/components/common/RichTextBox";
import { PrimaryButton } from "@/styles/mui/themeComponents";

// ==== IMPORT PROVIDERS ====
import { useDispatch } from "react-redux";
import { addBlogPost, getMovieDetails } from "@/redux/actions/user/blogActions";
import StoreHooks from "@/redux/contextProvider/storeHooks";
import { fetchBlogPosts } from "@/redux/reducers/user/blogPostReducer";

const BlogPostForm = () => {
  const dispatch = useDispatch();
  const storeHooks = useContext(StoreHooks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [movieName, setMovieName] = useState("");
  const [director, setDirector] = useState("");
  const [image, setImage] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [showTextFields, setShowTextFields] = useState(false);
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (content != "") {
      setShowTextFields(true);
    }
  }, [content]);

  // Add debounce function to prevent too many API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Handle movie search
  const handleMovieSearch = debounce(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setMovieSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getMovieDetails(searchTerm);

      setMovieSuggestions([results] || []);
    } catch (error) {
      console.error("Error fetching movie suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleAddBlogPost = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    const values = {
      title,
      description,
      content,
      movie: movieName,
      director,
      image,
      genre,
      rating,
    };
    const res = await addBlogPost(values, storeHooks);
    if (res.status == 200) {
      setTitle("");
      setDescription("");
      setContent("");
      setMovieName("");
      setDirector("");
      setImage("");
      setShowTextFields(false);
      setMovieSuggestions([]);
      setIsPublishing(false);
      dispatch(
        fetchBlogPosts({
          page: 0,
          pageSize: 10,
        })
      );
    }
  };

  return (
    <div>
      <Typography variant="h6" mb={2}>
        Write a blog post
      </Typography>
      {showTextFields && (
        <TextField
          size="small"
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      {showTextFields && (
        <TextField
          size="small"
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      {showTextFields && (
        <Autocomplete
          freeSolo
          options={movieSuggestions}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.Title
          }
          loading={isLoading}
          value={movieName}
          onChange={(_, newValue) => {
            setMovieName(
              typeof newValue === "string" ? newValue : newValue?.Title || ""
            );
            setDirector(newValue?.Director || "");
            setImage(newValue?.Poster || "");
            setDescription(newValue?.Plot || "");
            setGenre(newValue?.Genre || "");
            setRating(newValue?.imdbRating || "");
          }}
          onInputChange={(_, newInputValue) => {
            setMovieName(newInputValue);
            handleMovieSearch(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              fullWidth
              label="Movie Name"
              sx={{ mb: 2 }}
            />
          )}
        />
      )}
      {movieName && (
        <TextField
          size="small"
          fullWidth
          label="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      {image && (
        <Box>
          <img
            src={image}
            alt="Movie Poster"
            style={{ width: "auto", height: "100px" }}
          />
        </Box>
      )}
      <RichTextBox value={content} setValue={setContent} />
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <PrimaryButton
          variant="contained"
          color="background.darkPaper"
          onClick={handleAddBlogPost}
          disabled={isPublishing}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </PrimaryButton>
      </Box>
    </div>
  );
};

export default BlogPostForm;
