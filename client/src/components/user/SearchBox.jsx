import { useState } from "react";
import { Box, TextField, useTheme, IconButton } from "@mui/material";
import Iconify from "@/components/common/Iconify";

// ==== IMPORT PROVIDERS ====
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "@/redux/reducers/user/blogPostReducer";

const SearchBox = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const values = {
      page: 0,
      pageSize: 10,
      search,
    };
    dispatch(fetchBlogPosts(values));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(239, 238, 187, 1)",
          border: "1px solid rgba(7, 7, 7, 1)",
          boxShadow: "0px 3px 0px 0px rgba(7, 7, 7, 1)",

          borderRadius: "101px",
          p: 1,
          width: "60%",
        }}
      >
        <TextField
          placeholder="What are you looking for?"
          variant="standard"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              ml: 2,
              mr: 10,
              "& .MuiInputBase-input": {
                border: "none",
                outline: "none",
                width: "100%",
                color: "rgba(0, 0, 0, 1)",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                letterSpacing: "0px",
              },
            },
          }}
        />
        <IconButton
          sx={{
            background: " rgba(255, 0, 0, 1)",
            borderRadius: "101px",
            p: 1,
          }}
          onClick={handleSearch}
        >
          <Iconify
            icon="iconamoon:search"
            sx={{
              color: "white",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchBox;
