import { Box, Button, Snackbar, Alert, CircularProgress, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import api from "../../components/api";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [employees, setEmployees] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      setLoading(true);
      api.get("employees/")
        .then((res) => {
          setEmployees(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching employees:", err.message);
          setSnackbarOpen(true);
          setSnackbarMessage("Failed to fetch employees.");
          setSnackbarSeverity("error");
          setLoading(false);
        });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setSnackbarOpen(true);
      setSnackbarMessage("Please select a file first.");
      setSnackbarSeverity("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    api.post("upload-excel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setEmployees(res.data);
        setSnackbarOpen(true);
        setSnackbarMessage("File uploaded and data updated successfully!");
        setSnackbarSeverity("success");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error uploading file:", err.message);
        setSnackbarOpen(true);
        setSnackbarMessage("File upload failed.");
        setSnackbarSeverity("error");
        setLoading(false);
      });
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "hours_worked", headerName: "Hours Worked", flex: 1 },
    { field: "hourly_rate", headerName: "Hourly Rate", flex: 1 },
    { field: "salary", headerName: "Salary", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="EMPLOYEES" subtitle="Managing Employees" />
      <Box mb="20px" display="flex" alignItems="center" gap="10px">
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { backgroundColor: colors.blueAccent[500] },
          }}
        >
          Choose File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          sx={{
            backgroundColor: colors.primary[500],
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { backgroundColor: colors.primary[700] },
          }}
        >
          Upload Excel
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            checkboxSelection
            rows={employees}
            columns={columns}
            getRowId={(row) => row.id}
          />
        )}
      </Box>
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

export default Team;
