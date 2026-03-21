import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart2, Settings } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center justify-around">
      {tabs.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 cursor-pointer relative px-4 py-1"
          >
            {/* Pill indicator */}
            {isActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-800 dark:bg-white rounded-full" />
            )}
            <Icon
              size={22}
              className={
                isActive
                  ? "text-zinc-800 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }
            />
            <span
              className={`text-xs font-medium ${isActive ? "text-zinc-800 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
