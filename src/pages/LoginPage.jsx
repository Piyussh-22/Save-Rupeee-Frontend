import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Calendar, Clock } from "lucide-react";
import api from "../services/api.js";
import { fetchMe } from "../features/auth/authSlice.js";

export default function LoginPage() {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [redirecting, setRedirecting] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [recoverError, setRecoverError] = useState("");

  const error = searchParams.get("error");
  const deletedAt = searchParams.get("deleted_at");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    setRedirecting(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const getRecoveryInfo = () => {
    if (!deletedAt) return null;

    const deleted = new Date(deletedAt);
    const deadline = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();

    const daysLeft = Math.max(
      0,
      Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)),
    );

    return {
      deletedOn: deleted.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      recoverBy: deadline.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      daysLeft,
    };
  };

  const recoveryInfo = getRecoveryInfo();

  if (loading) return null;

  // Recovery screen
  if (error === "account_deleted" && recoveryInfo && !recovered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/SaveRupeeeLogo.png"
              alt="Save Rupee"
              className="h-16 w-56 object-contain mb-3 drop-shadow-md"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-amber-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Account Deleted
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your account is scheduled for permanent deletion. You can recover
              it before the deadline.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={15} />
                  <span>Deleted on</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {recoveryInfo.deletedOn}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={15} />
                  <span>Recover before</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {recoveryInfo.recoverBy}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Days remaining
                </span>
                <span
                  className={`text-sm font-bold ${
                    recoveryInfo.daysLeft <= 7
                      ? "text-red-500"
                      : "text-emerald-500"
                  }`}
                >
                  {recoveryInfo.daysLeft} days
                </span>
              </div>
            </div>

            {recoverError && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {recoverError}
              </p>
            )}

            <button
              onClick={async () => {
                try {
                  setRecovering(true);
                  setRecoverError("");

                  await api.post("/auth/recover", {
                    email: email ? decodeURIComponent(email) : undefined,
                  });

                  setRecovered(true);
                  dispatch(fetchMe());
                } catch {
                  setRecoverError("Recovery failed. Please try again.");
                } finally {
                  setRecovering(false);
                }
              }}
              disabled={recovering}
              className="w-full bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-2xl transition cursor-pointer disabled:opacity-50 mb-3"
            >
              {recovering ? "Recovering..." : "Recover My Account"}
            </button>

            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full text-sm text-gray-400 dark:text-gray-500 py-2 cursor-pointer"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (recovered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">✅</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Account Recovered!
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your account has been successfully restored. You can now log in.
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 font-medium py-3 rounded-2xl cursor-pointer"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/SaveRupeeeLogo.png"
            alt="Save Rupee"
            className="h-16 w-56 object-contain mb-3 drop-shadow-md"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Track expenses, earnings & investments
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-800 p-6 shadow-xl">
          {error === "auth_failed" && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-2xl px-4 py-3 text-center">
              Login failed. Please try again.
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={redirecting}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-gray-700 dark:text-gray-200 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {redirecting ? "Redirecting..." : "Continue with Google"}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-5">
            By continuing, you agree to our terms
          </p>
        </div>
      </div>
    </div>
  );
}
