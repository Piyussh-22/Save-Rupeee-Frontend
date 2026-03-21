import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
