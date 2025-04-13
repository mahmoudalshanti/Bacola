"use client";

import { motion } from "framer-motion";

const PageLoading = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
    </div>
  );
};

export default PageLoading;
