import Link from "next/link";
import { Typography, Breadcrumbs } from "@mui/material";

// ==== IMPORT COMPONENTS ====
import UsersTable from "../tables/UsersTable";

const Users = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin">
          Dashboard
        </Link>
        <Typography sx={{ color: "text.primary" }}>Users</Typography>
      </Breadcrumbs>

      {/* ==== TABLE ==== */}
      <UsersTable />
    </>
  );
};

export default Users;
