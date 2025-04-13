"use client";

import { motion } from "framer-motion";

const CustomLoading = ({ props }: { props: string }) => {
  return (
    <div className="bg-gradient-to-br flex items-center justify-center relative overflow-hidden">
      <motion.div
        className={`border-4 border-t-4  ${props} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default CustomLoading;
