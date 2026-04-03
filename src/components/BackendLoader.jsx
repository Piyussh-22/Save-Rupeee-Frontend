import { useEffect, useState } from "react";

const BackendLoader = ({ ready }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 3.5; // fast start
        if (prev < 80) return prev + 1.5; // medium
        if (prev < 94) return prev + 0.4; // slow
        if (prev < 97) return prev + 0.08; // crawl
        return prev; // stuck at 97, waiting for backend
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ready) {
      setProgress(100);
      const hide = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(hide);
    }
  }, [ready]);

  if (!visible) return null;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center px-4 bg-black">
      <img
        src="/SaveRupeeeLogo.png"
        alt="SaveRupeee"
        className="h-14 w-auto mb-8 opacity-90"
      />

      <p className="text-lg font-semibold text-center text-white">
        Starting server...
      </p>

      <p className="text-sm text-gray-400 mt-2 text-center max-w-md">
        This app is hosted on a free server. It may take up to a minute to wake
        up after inactivity.
      </p>

      <div className="w-full max-w-md mt-6">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {progress >= 97 ? "Almost there, hold on..." : "Waking up backend..."}
        </p>
      </div>
    </div>
  );
};

export default BackendLoader;
