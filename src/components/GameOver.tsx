'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { translations } from '@/lib/translations';

export default function GameOver() {
  const { language, score, questions, resetGame, newCategory, setLoading, startGame } = useGameStore();
  const t = translations[language || 'en'];
  const isRTL = language === 'ar';

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const fireConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ['#C9A227', '#D4AF37', '#E8D5A3', '#FFD700', '#FFA500'],
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  useEffect(() => {
    if (percentage >= 70) fireConfetti();
  }, [percentage, fireConfetti]);

  const getMessage = () => {
    if (percentage === 100) return t.perfect;
    if (percentage >= 80) return t.amazing;
    if (percentage >= 60) return t.almostThere;
    return t.goodTry;
  };

  const handlePlayAgain = () => {
    setLoading(true);
    startGame();
  };

  const handleNewCategory = () => {
    newCategory();
  };

  return (
    <div className="game-container relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-right" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-right" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="game-card"
        style={{ maxWidth: '380px' }}
      >
        <div className={`text-center ${isRTL ? 'font-arabic' : ''}`} style={{ padding: '20px' }}>

          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ marginBottom: '20px' }}
          >
            <Image
              src="/icon-trophy.png"
              alt=""
              width={60}
              height={60}
              className="mx-auto"
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="title-main text-xl"
            style={{ marginBottom: '8px' }}
          >
            {t.gameOver}
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-gold font-bold"
            style={{ marginBottom: '20px' }}
          >
            {getMessage()}
          </motion.p>

          {/* Score Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="score-display"
            style={{ marginBottom: '24px', padding: '16px' }}
          >
            <p className="text-sm opacity-90">{t.yourScore}</p>
            <p className="text-3xl font-bold text-gold-light" style={{ margin: '8px 0' }}>
              {score} / {totalQuestions}
            </p>
            <div className="flex items-center justify-center" style={{ gap: '10px' }}>
              <div className="w-full bg-brown-light/50 rounded-full h-2 border border-gold-pale">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="bg-gradient-to-r from-gold to-gold-light rounded-full h-full"
                />
              </div>
              <span className="font-bold text-gold text-sm" style={{ minWidth: '45px' }}>{percentage}%</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePlayAgain}
              className="btn-primary"
              style={{ padding: '12px 16px', fontSize: '14px' }}
            >
              {t.playAgain}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNewCategory}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '14px' }}
            >
              {t.newCategory}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="btn-text w-full"
              style={{ fontSize: '13px' }}
            >
              Start Over
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ paddingTop: '16px', borderTop: '2px solid var(--gold-pale)' }}
          >
            <p className="text-brown-light text-xs">{t.thankYou}</p>
            <p className="text-base font-bold text-brown-dark" style={{ marginTop: '4px' }}>{t.enjoyMeal}</p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
