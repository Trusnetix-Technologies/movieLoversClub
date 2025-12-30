import { useState, useEffect, useContext, useRef } from "react";
import {
  Typography,
  TextField,
  Box,
  Autocomplete,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
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
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [movieName, setMovieName] = useState("");
  const [director, setDirector] = useState("");
  const [image, setImage] = useState(""); // URL from OMDB or uploaded file URL
  const [imageFile, setImageFile] = useState(null); // File object for upload
  const [imagePreview, setImagePreview] = useState(""); // Preview URL for selected file
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

  // Clean up image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        storeHooks.handleOpenSnackBar("Please select an image file", "error");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        storeHooks.handleOpenSnackBar(
          "Image size should be less than 5MB",
          "error"
        );
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImage(""); // Clear OMDB image when custom image is selected
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", image);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("movie", movieName);
    formData.append("director", director);
    formData.append("genre", genre);
    formData.append("rating", rating);

    const res = await addBlogPost(formData, storeHooks);
    if (res.status == 200) {
      setTitle("");
      setDescription("");
      setContent("");
      setMovieName("");
      setDirector("");
      handleClearImage();
      setGenre("");
      setRating("");
      setShowTextFields(false);
      setMovieSuggestions([]);
      setIsPublishing(false);
      dispatch(
        fetchBlogPosts({
          page: 0,
          pageSize: 10,
        })
      );
    } else {
      setIsPublishing(false);
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

      {/* Image Picker Section */}
      {showTextFields && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Poster Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Show preview if image exists */}
          {imagePreview || image ? (
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <img
                src={imagePreview || image}
                alt="Poster Preview"
                style={{
                  width: "auto",
                  height: "140px",
                  display: "block",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleUploadClick}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                >
                  <CloudUploadIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleClearImage}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "error.main" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            /* Upload button when no image */
            <Box
              onClick={handleUploadClick}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 160,
                height: 140,
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <ImageIcon
                sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Click to upload
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Max 5MB
              </Typography>
            </Box>
          )}
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
