import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";  // Import React and useState
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";  // Import axios for API requests

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleFormSubmit = async (values, resetForm) => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setSnackbarMessage("Access token not found.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/create_employee/', 
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSnackbarMessage('Employee created successfully!');
      setSeverity("success");
      setOpenSnackbar(true);
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      setSnackbarMessage('Error creating employee. Please try again.');
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD EMPLOYEE" subtitle="Create a New Employee Profile" />

      <Formik
        onSubmit={(values, { resetForm }) => {
          console.log("Submitting values:", values);  // Log before the submit
          handleFormSubmit(values, resetForm);  // Pass resetForm to handleFormSubmit
        }}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="DOJ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date_of_joining}
                name="date_of_joining"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                name="phone_number"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Department"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.department}
                name="department"
                error={!!touched.department && !!errors.department}
                helperText={touched.department && errors.department}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salary"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salary}
                name="salary"
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add New Employee
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  date_of_joining: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phone_number: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  department: yup.string().required("required"),
  salary: yup.number().positive("Salary must be positive").required("required"),
});

const initialValues = {
  name: "",
  date_of_joining: "",
  email: "",
  phone_number: "",
  department: "",
  salary: "",
};

export default Form;
