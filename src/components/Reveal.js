'use client';
import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, trigger = false, direction = "up" }) {
  // Logika menentukan posisi awal berdasarkan arah
  const directions = {
    up: { x: 0, y: 200, rotateX: -20 },
    down: { x: 0, y: -200, rotateX: 20 },
    left: { x: -200, y: 0, rotateY: 20 },
    right: { x: 200, y: 0, rotateY: -20 },
    fade: { x: 0, y: 0, scale: 0.5 }
  };

  const initialPos = directions[direction] || directions.up;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        ...initialPos
      }}
      whileInView={trigger ? { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        rotateY: 0 
      } : {}}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ 
        duration: 2.0, // Diperlambat menjadi 2 detik
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] // Ease out expo: sangat halus di akhir
      }}
      style={{ perspective: 1200 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}