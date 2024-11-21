import React, { useState } from "react";
import { Button, TextField, Box, Typography, Container, Paper, Grid, CircularProgress, Link, Snackbar, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Custom theme for Material UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4", // Teal primary color
    },
    background: {
      default: "#212121", // Dark background
      paper: "#303030", // Paper background for form (lighter shade of dark)
    },
    text: {
      primary: "#ffffff", // White text on dark background
      secondary: "#b0bec5", // Light grey text for secondary elements
    },
  },
});

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(""); // For success messages
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the snackbar (error or success)

  const { setIsAuthenticated } = useAuth(); // Use useAuth hook to get setIsAuthenticated
  const navigate = useNavigate(); // For navigation after successful login

  const userInfo = { username, password };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when form is submitted
    setError(""); // Clear previous error messages
    setSuccess(""); // Clear previous success messages

    try {
      const res = await api.post("token/", userInfo);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setUsername("");
      setPassword("");
      setIsAuthenticated(true); // Set authentication state
      setIsLoggedIn(true); // Update login state
      setLoading(false); // Stop loading
      setSuccess("Successfully logged in! Redirecting..."); // Success message
      setSnackbarMessage("Login successful! Redirecting...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Open Snackbar
      setTimeout(() => navigate("/team"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setLoading(false); // Stop loading
      setError("Invalid username or password"); // Set error if login fails
      setSnackbarMessage("Login failed! Please check your username or password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open Snackbar
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Paper
          elevation={10}
          sx={{
            padding: "40px 30px",
            backgroundColor: "background.paper",
            borderRadius: "16px",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.3)",
            transform: "scale(1)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)", // Slight zoom effect when the form is hovered
            },
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
            <Typography variant="h4" sx={{ color: "text.primary", fontWeight: "bold", marginBottom: "10px" }}>
              Login
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", marginTop: "10px", fontSize: "14px" }}>
              Please enter your Username and Password to continue
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{
                    "& .MuiInputLabel-root": { color: "text.primary" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{
                    "& .MuiInputLabel-root": { color: "text.primary" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    padding: "14px",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "50px",
                    fontSize: "16px",
                    transition: "background-color 0.3s ease",
                    "&:hover": { backgroundColor: "#007c91" },
                    "&.Mui-disabled": { backgroundColor: "#00838f" },
                  }}
                  disabled={loading} // Disable the button while loading
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", marginTop: "15px" }}>
                <Typography variant="body2" color="text.secondary">
                  <Link
                    to="/signup"
                    style={{
                      color: "#00bcd4",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Close after 6 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default LoginForm;
