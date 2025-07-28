import { motion } from "framer-motion";
import { type ReactNode } from "react";

const MotionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;

