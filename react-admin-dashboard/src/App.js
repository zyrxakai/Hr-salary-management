import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import LoginForm from "./components/user/LoginForm";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import EditProfile from "./scenes/editprofile/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./components/AuthContext";
import SignUpForm from "./components/user/SignupForm";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <AuthContent isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

function AuthContent({ isSidebar, setIsSidebar }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {isAuthenticated && <Topbar setIsSidebar={setIsSidebar} />}
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/team" /> : <Navigate to="/login" />}
          />

          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />

          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected Routes */}
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
