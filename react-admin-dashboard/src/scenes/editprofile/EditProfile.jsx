import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import api from "../../components/api";

const EditProfile = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch admin details (example)
  const fetchAdminDetails = () => {
    api.get("admin-profile/").then((res) => {
      setAdminDetails(res.data);
    });
  };

  // Handle form submission
  const handleSave = () => {
    api.put("register/", adminDetails)
      .then(() => {
        setSnackbarOpen(true);
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setOpen(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err.message);
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to update profile.");
        setSnackbarSeverity("error");
      });
  };

  const handleInputChange = (e) => {
    setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      {/* Edit Profile Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
          fetchAdminDetails();
        }}
      >
        Edit Profile
      </Button>

      {/* Modal for Editing Profile */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={adminDetails.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={adminDetails.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={adminDetails.password}
            onChange={handleInputChange}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap="10px">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
