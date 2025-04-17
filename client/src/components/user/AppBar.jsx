import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

// ==== IMPORT PROVIDER ====
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, selectAuthData } from "@/redux/reducers/authReducer";
import { logout } from "@/redux/actions/authActions";
import { useRouter } from "next/router";
const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthData);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (auth.loading != "loaded") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">MovieLoversClub</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {auth.authData != "error" ? (
          <Box>
            <Avatar
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ cursor: "pointer" }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {auth.authData.role === "ADMIN" && (
                <MenuItem onClick={() => router.push("/admin")}>
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  logout();
                  dispatch(fetchCurrentUser());
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
