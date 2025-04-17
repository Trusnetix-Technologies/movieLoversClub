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
import { getUserById, updateUser } from "@/redux/actions/admin/userActions";
import Loading from "@/components/common/Loading";

const UserForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const storeHooks = useContext(StoreHooks);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserById = async () => {
    setLoading(true);
    const res = await getUserById(id, storeHooks);
    if (res.status == 200) {
      setUser(res.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchUserById();
    }
  }, [id]);

  const handleUpdateUser = async () => {
    const res = await updateUser(user, storeHooks);
    if (res.status == 200) {
      router.push("/admin/users");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" mt={2} mb={2}>
          Edit User
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={user?.name}
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user?.role}
              defaultValue={user?.role}
              label="Role"
              onChange={(e) => {
                setUser({ ...user, role: e.target.value });
              }}
            >
              <MenuItem value={"USER"}>USER</MenuItem>
              <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateUser}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserForm;
