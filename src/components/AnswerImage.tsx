'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnswerImageProps {
  answer: string;
  category: string;
  show: boolean;
}

export default function AnswerImage({ answer, category, show }: AnswerImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (show && answer) {
      setLoading(true);
      setError(false);

      // Create search query based on answer and category
      const query = `${answer} ${category} middle eastern`;

      // Use Unsplash Source API directly (no key needed)
      const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;

      // Preload the image
      const img = new window.Image();
      img.onload = () => {
        setImageUrl(url);
        setLoading(false);
      };
      img.onerror = () => {
        setError(true);
        setLoading(false);
      };
      img.src = url;
    }
  }, [show, answer, category]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{
        marginTop: '12px',
        marginBottom: '12px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '3px solid var(--gold)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }}
    >
      {loading && (
        <div
          style={{
            width: '100%',
            height: '150px',
            background: 'linear-gradient(135deg, var(--gold-pale) 0%, var(--cream) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '24px' }}
          >
            📷
          </motion.div>
        </div>
      )}

      {imageUrl && !loading && !error && (
        <div style={{ position: 'relative', width: '100%', height: '150px' }}>
          <Image
            src={imageUrl}
            alt={answer}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized // Required for external URLs
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '8px 12px',
            }}
          >
            <p style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
              {answer}
            </p>
          </div>
        </div>
      )}

      {/* Don't show anything if image fails to load */}
    </motion.div>
  );
}
