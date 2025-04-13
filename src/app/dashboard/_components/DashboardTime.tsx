"use client";

import { useEffect, useState } from "react";

const DashboardTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDateTime(new Date());
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDateTime?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDateTime?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="mb-7">
      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening with your dashboard today.
        </p>
        {currentDateTime ? (
          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            <span>{formattedDate}</span>
            <span className="mx-2">|</span>
            <span>{formattedTime}</span>
          </div>
        ) : (
          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTime;
