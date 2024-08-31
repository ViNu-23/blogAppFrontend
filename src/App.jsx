/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Route,
  Routes,
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

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";
  console.log("token from app", token);

  return (
    <>
      {!hideNavbar && <NavbarPage />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/read/:id" element={<ReadPost />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Routes */}
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editpost/:id" element={<EditPost />} />
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

