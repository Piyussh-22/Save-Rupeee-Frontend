import { useEffect, useState } from "react";

const BackendLoader = () => {
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center px-4 bg-black">
      {/* Logo */}
      <img
        src="/SaveRupeeeLogo.png"
        alt="SaveRupeee"
        className="h-14 w-auto mb-8 opacity-90"
      />

      {/* Spinner */}
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-6"></div>

      {/* Title */}
      <p className="text-lg md:text-xl font-semibold text-center text-white">
        Starting server...
      </p>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-400 mt-2 text-center max-w-md">
        This app is hosted on a free server. It may take up to 30 seconds to
        wake up after inactivity.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mt-6">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Waking up backend...
        </p>
      </div>
    </div>
  );
};

export default BackendLoader;
