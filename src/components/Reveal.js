'use client';
import { motion } from 'framer-motion';

export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, 
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0, 
      transition: { duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] } 
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.15 }} 
      variants={variants} 
      className={className}
    >
      {children}
    </motion.div>
  );
}