import Link from "next/link";
import { Typography, Breadcrumbs } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import UserForm from "../forms/UserForm";

const EditUser = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/admin/users">
          Users
        </Link>
        <Typography sx={{ color: "text.primary" }}>Edit User</Typography>
      </Breadcrumbs>

      {/* ==== TABLE ==== */}
      <UserForm />
    </>
  );
};

export default EditUser;
