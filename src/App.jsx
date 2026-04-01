import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/auth/authSlice.js";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// Auth
import ProtectedRoute from "./features/auth/ProtectedRoute.jsx";
import CurrencySetup from "./features/auth/CurrencySetup.jsx";

// Layout
import Navbar from "./components/Navbar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import BackendLoader from "./components/BackendLoader.jsx";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <Navbar />
      {children}
      <BottomNav />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const loaderDelay = setTimeout(() => {
      setShowLoader(true);
    }, 1500);

    const fallback = setTimeout(() => {
      setReady(true);
      setShowLoader(false);
    }, 30000);

    fetch("https://save-rupeee-backend.onrender.com/health")
      .then(() => {
        clearTimeout(loaderDelay);
        clearTimeout(fallback);
        setReady(true);
        setShowLoader(false);
      })
      .catch(() => {
        clearTimeout(loaderDelay);
        clearTimeout(fallback);
        setReady(true);
        setShowLoader(false);
      });
  }, []);

  //fetchMe only fires after backend is confirmed awake
  useEffect(() => {
    if (ready) {
      dispatch(fetchMe());
    }
  }, [ready, dispatch]);

  //Show loader if backend is slow, otherwise show a clean splash
  if (!ready) {
    return showLoader ? (
      <BackendLoader />
    ) : (
      <div className="h-screen w-full bg-black" />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <CurrencySetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
