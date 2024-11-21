import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../components/api";
import Header from "../../components/Header";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      api.get("employees/")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.error("Error fetching employees:", err.message));
    }
  }, []);

  // Open the dialog with selected employee details
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  // Close the dialog and clear selected employee
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  // Handle input change in the dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited employee details
  const handleSave = () => {
    if (selectedEmployee) {
      api.put(`employees/${selectedEmployee.id}/`, selectedEmployee)
        .then((res) => {
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === selectedEmployee.id ? res.data : emp))
          );
          handleDialogClose();
        })
        .catch((err) => console.error("Error updating employee:", err.message));
    }
  };

  // Delete an employee
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      api.delete(`employees/${id}/`)
        .then(() => {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        })
        .catch((err) => console.error("Error deleting employee:", err.message));
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="CONTACTS" subtitle="List of Contacts for Future Reference" />
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
        <DataGrid
          rows={employees}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Dialog for Editing Employee */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <TextField
                label="Name"
                name="name"
                value={selectedEmployee.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Doj"
                name="date_of_joining"
                value={selectedEmployee.date_of_joining}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Department"
                name="department"
                value={selectedEmployee.department}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={selectedEmployee.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={selectedEmployee.phone_number}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
