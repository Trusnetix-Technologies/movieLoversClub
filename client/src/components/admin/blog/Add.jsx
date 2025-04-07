import Link from "next/link";
import { Typography, Breadcrumbs } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import BlogForm from "../forms/BlogForm";

const AddBlog = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/admin/blog">
          Blog
        </Link>
        <Typography sx={{ color: "text.primary" }}>Add Blog Post</Typography>
      </Breadcrumbs>

      {/* ==== TABLE ==== */}
      <BlogForm />
    </>
  );
};

export default AddBlog;
