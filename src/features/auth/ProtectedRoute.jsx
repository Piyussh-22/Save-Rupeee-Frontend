import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading, initialized } = useSelector((state) => state.auth);

  // Wait until fetchMe has actually been attempted before making a decision
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
