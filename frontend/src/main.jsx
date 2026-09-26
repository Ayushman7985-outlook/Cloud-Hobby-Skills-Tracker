import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Practice from "./pages/Practice";
import Goals from "./pages/Goals";
import Community from "./pages/Community";
import Profile from "./pages/Profile";

import "./style.css";

function NavBar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Hobby & Skills Tracker</div>

      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/community">Community</Link>
        <Link to="/profile">Profile</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

function ProtectedLayout() {
  return (
    <>
      <NavBar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/skills" element={<Skills />} />

          <Route path="/practice" element={<Practice />} />

          <Route path="/goals" element={<Goals />} />

          <Route path="/community" element={<Community />} />

          <Route path="/profile" element={<Profile />} />

          {/* If an authenticated user is still on /login,
              redirect them to the dashboard. */}
          <Route
            path="/login"
            element={<Navigate to="/" replace />}
          />

          {/* Any unknown authenticated route goes to Dashboard */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      {user ? (
        <ProtectedLayout />
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);