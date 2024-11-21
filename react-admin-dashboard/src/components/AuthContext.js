import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api";

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null); // Store the HR profile data


  const handleAuth = () => {
    const token = localStorage.getItem("access");
    if (token) {
      const decoded = jwtDecode(token);
      const expiry_date = decoded.exp;
      const current_time = Date.now() / 1000;
      
      if (expiry_date >= current_time) {
        setIsAuthenticated(true);
      } else {
        logout(); 
      }
    }
  };

  // Fetch username from the backend
  const getProfile = () => {
    api.get("/admin-profile/") // Call the backend API to get the HR profile
      .then(res => {
        setProfile(res.data); // Set the profile data
      })
      .catch(err => {
        console.log("Error fetching profile:", err.message);
      });
  };

  // Login the user (store the token)
  const login = (token) => {
    localStorage.setItem("access", token); // Store token in localStorage
    handleAuth(); // Validate token
  };

  // Logout the user (remove the token)
  const logout = () => {
    localStorage.removeItem("access"); // Remove token from localStorage
    setIsAuthenticated(false); // Update auth status
  };

  useEffect(() => {
    handleAuth(); // Check authentication status on component mount
     getProfile();
  }, []);

  const authValue = { isAuthenticated, username, login, logout, setIsAuthenticated }; // Add setIsAuthenticated here

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Define and export the useAuth hook
export const useAuth = () => useContext(AuthContext);
