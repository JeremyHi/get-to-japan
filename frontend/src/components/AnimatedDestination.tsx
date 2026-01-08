'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const destinations = ['Japan', 'Tokyo', 'HND', 'NRT'];

export default function AnimatedDestination() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative min-w-[140px] md:min-w-[180px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={destinations[currentIndex]}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="gradient-text inline-block"
        >
          {destinations[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
