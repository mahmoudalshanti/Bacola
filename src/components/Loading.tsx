"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="bg-gradient-to-br flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="w-7 h-7 border-4 border-t-4 border-t-black border-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;
