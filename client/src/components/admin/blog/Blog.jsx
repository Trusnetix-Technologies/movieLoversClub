import Link from "next/link";
import { Typography, Breadcrumbs } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import BlogTable from "../tables/BlogTable";

const Blog = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin">
          Dashboard
        </Link>
        <Typography sx={{ color: "text.primary" }}>Blog Posts</Typography>
      </Breadcrumbs>

      {/* ==== TABLE ==== */}
      <BlogTable />
    </>
  );
};

export default Blog;
