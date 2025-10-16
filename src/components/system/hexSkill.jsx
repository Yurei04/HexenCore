"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function DialogScreen({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-[80%] max-w-[95vw]">
            {/* Background screen area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white rounded-lg overflow-auto z-0">
              {children}
            </div>

            {/* Foreground image frame */}
            <Image
              src="/images/control3.png"
              alt="Control screen"
              width={900}
              height={600}
              className="relative z-10 w-full h-auto pointer-events-none select-none"
              priority
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
