import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { clearUser } from "../features/auth/authSlice.js";
import { toggleTheme } from "../features/settings/themeSlice.js";
import Modal from "./Modal.jsx";
import api from "../services/api.js";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowInstall(false);
    setDeferredPrompt(null);
  };

  const handleToggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newMode);
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await api.post("/auth/logout");
      dispatch(clearUser());
      navigate("/login", { replace: true });
    } catch {
      // Even if logout API fails, clear local state and redirect
      // This prevents the user from being stuck logged in on the frontend
      dispatch(clearUser());
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Left: app name */}
        <div className="flex items-center gap-2">
          <img
            src="/SaveRupeeeLogo.png"
            alt="Save Rupeee"
            className="h-8 w-auto"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showInstall && (
            <button
              onClick={handleInstall}
              className="text-xs bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-full font-medium cursor-pointer"
            >
              Install
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={handleToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <img
                src={user?.avatar_url}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-48 py-2 z-50">
                <p className="px-4 py-2 text-xs text-gray-400 font-medium truncate">
                  {user?.name}
                </p>
                <hr className="border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowLogout(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout confirm modal */}
      <Modal
        isOpen={showLogout}
        onClose={() => {
          setShowLogout(false);
          setLogoutError("");
        }}
        title="Logout"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to log out?
        </p>
        {logoutError && (
          <p className="text-red-500 text-sm mb-3 text-center">{logoutError}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowLogout(false);
              setLogoutError("");
            }}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium py-3 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Yes, Logout"}
          </button>
        </div>
      </Modal>
    </>
  );
}
