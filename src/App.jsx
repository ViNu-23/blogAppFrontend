/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import NavbarPage from "./Pages/NavbarPage";
import CreatePost from "./Pages/CreatePost";
import ReadPost from "./Pages/ReadPost";
import NotFoundPage from "./Pages/NotFoundPage";
import PublicProfile from "./Pages/PublicProfile";
import axios from "axios";
import EditPost from "./Pages/EditPost";

// Set the base URL for Axios
// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.baseURL = "https://blog-app-backend-green.vercel.app";
axios.defaults.withCredentials = true;

// Retrieve the token from session storage
const token = sessionStorage.getItem("token");

// Add Axios request interceptor to include the token in headers
axios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ProtectedRoute component to handle protected routes
const ProtectedRoute = ({ element }) => {
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <NavbarPage />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/read/:id" element={<ReadPost />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Routes */}
        <Route path="/create" element={<ProtectedRoute element={<CreatePost />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/editpost/:id" element={<ProtectedRoute element={<EditPost />} />} />

      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
