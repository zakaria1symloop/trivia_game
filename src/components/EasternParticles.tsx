'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'star' | 'crescent' | 'diamond' | 'dot';
  duration: number;
  delay: number;
}

const particleShapes = {
  star: '✦',
  crescent: '☽',
  diamond: '◇',
  dot: '•',
};

export default function EasternParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on mount
    const types: Particle['type'][] = ['star', 'crescent', 'diamond', 'dot'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 14 + 6,
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.random() * 12 + 15,
        delay: Math.random() * 8,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div
      className="eastern-particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: '110vh',
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.7, 0.7, 0],
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            fontSize: `${particle.size}px`,
            color: particle.type === 'crescent'
              ? 'rgba(212, 175, 55, 0.5)'
              : particle.type === 'star'
              ? 'rgba(232, 213, 163, 0.6)'
              : particle.type === 'diamond'
              ? 'rgba(201, 162, 39, 0.4)'
              : 'rgba(255, 215, 0, 0.5)',
            textShadow: '0 0 10px rgba(201, 162, 39, 0.3)',
          }}
        >
          {particleShapes[particle.type]}
        </motion.div>
      ))}
    </div>
  );
}
