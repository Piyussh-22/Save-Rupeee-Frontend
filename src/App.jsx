import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/auth/authSlice.js";
import api from "./services/api.js";

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
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    const loaderDelay = setTimeout(() => {
      setShowLoader(true);
    }, 1500);

    const fallback = setTimeout(() => {
      // Backend did not respond in 30s — mark it as down, don't silently proceed
      setBackendDown(true);
      setShowLoader(false);
    }, 30000);

    // Use centralized api instance instead of raw fetch
    api
      .get("/health")
      .then(() => {
        clearTimeout(loaderDelay);
        clearTimeout(fallback);
        setReady(true);
        setShowLoader(false);
      })
      .catch(() => {
        clearTimeout(loaderDelay);
        clearTimeout(fallback);
        // Backend is reachable but returned an error — still proceed
        // (health endpoint may not exist in all envs)
        setReady(true);
        setShowLoader(false);
      });
  }, []);

  // fetchMe only fires after backend is confirmed awake
  useEffect(() => {
    if (ready) {
      dispatch(fetchMe());
    }
  }, [ready, dispatch]);

  // Backend never responded — show a clear error instead of broken UI
  if (backendDown) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-4">
        <img
          src="/SaveRupeeeLogo.png"
          alt="SaveRupeee"
          className="h-14 w-auto mb-8 opacity-90"
        />
        <p className="text-white text-lg font-semibold mb-2">
          Server unavailable
        </p>
        <p className="text-gray-400 text-sm text-center max-w-sm">
          The backend did not respond. Please try again in a few minutes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 bg-white text-black rounded-full text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

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
