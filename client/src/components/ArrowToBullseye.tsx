import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ArrowToBullseye() {
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 100);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* SVG Container for arrow path animation */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Bullseye target on the right */}
        <g id="bullseye">
          {/* Outer ring */}
          <circle cx="320" cy="100" r="40" fill="none" stroke="#ef4444" strokeWidth="8" />
          {/* Middle ring */}
          <circle cx="320" cy="100" r="26" fill="none" stroke="#f97316" strokeWidth="6" />
          {/* Inner circle */}
          <circle cx="320" cy="100" r="12" fill="#fbbf24" />
        </g>

        {/* Animated arrow path */}
        {isAnimating && (
          <>
            {/* Arrow shaft line */}
            <motion.line
              x1="60"
              y1="100"
              x2="280"
              y2="100"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Arrow head (triangle) */}
            <motion.polygon
              points="280,100 270,90 275,100 270,110"
              fill="#3b82f6"
              initial={{ opacity: 0, x: -220 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Impact flash when arrow hits bullseye */}
            <motion.circle
              cx="320"
              cy="100"
              r="0"
              fill="#fbbf24"
              opacity="0.8"
              initial={{ r: 0, opacity: 0.8 }}
              animate={{ r: 35, opacity: 0 }}
              transition={{
                delay: 1.5,
                duration: 0.6,
                ease: "easeOut"
              }}
            />
          </>
        )}
      </svg>

      {/* Dashie on the left pulling the arrow */}
      <motion.div
        className="absolute left-8 flex flex-col items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src="/dashie-hero.png"
          alt="Dashie pulling arrow"
          className="w-20 h-20 md:w-24 md:h-24 object-contain"
          animate={{
            y: isAnimating ? [0, -5, 0] : 0,
            rotate: isAnimating ? [-2, 2, -2] : 0
          }}
          transition={{
            duration: 0.6,
            repeat: isAnimating ? Infinity : 0,
            repeatType: "loop"
          }}
        />
        <p className="text-sm font-semibold text-primary mt-2 whitespace-nowrap">
          Pull!
        </p>
      </motion.div>

      {/* Celebration particles when arrow hits (optional) */}
      {isAnimating && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{
                x: 320,
                y: 100,
                opacity: 1
              }}
              animate={{
                x: 320 + Math.cos((i / 5) * Math.PI * 2) * 60,
                y: 100 + Math.sin((i / 5) * Math.PI * 2) * 60,
                opacity: 0
              }}
              transition={{
                delay: 1.5,
                duration: 0.8,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
