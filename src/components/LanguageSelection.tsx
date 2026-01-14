'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore, Language } from '@/store/gameStore';

export default function LanguageSelection() {
  const setLanguage = useGameStore((state) => state.setLanguage);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="game-container relative">
      {/* Corner Decorations */}
      <Image
        src="/corner-decoration.png"
        alt=""
        width={80}
        height={80}
        className="corner-decoration top-left"
      />
      <Image
        src="/corner-decoration.png"
        alt=""
        width={80}
        height={80}
        className="corner-decoration top-right"
      />
      <Image
        src="/corner-decoration.png"
        alt=""
        width={80}
        height={80}
        className="corner-decoration bottom-left"
      />
      <Image
        src="/corner-decoration.png"
        alt=""
        width={80}
        height={80}
        className="corner-decoration bottom-right"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="game-card"
      >
        <div className="card-padding text-center">
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="logo-container">
              <Image
                src="/logo.png"
                alt="Restaurant Logo"
                width={120}
                height={120}
                priority
              />
            </div>
            <h1 className="title-main mt-4">ALEPPO</h1>
            <p className="title-sub mt-1">Discover the Ancient City</p>
          </motion.div>

          <div className="divider-gold" />

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="title-main text-xl mb-1">Select Your Language</h2>
            <p className="font-arabic-classic text-brown-light text-lg">اختر لغتك</p>
          </motion.div>

          {/* Language Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-5"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageSelect('en')}
              className="lang-btn"
            >
              <span className="text-xl font-bold">English</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageSelect('ar')}
              className="lang-btn font-arabic-classic"
            >
              <span className="text-xl font-bold">العربية</span>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-4 border-t-2 border-gold-pale"
          >
            <p className="text-brown-light text-sm">Learn fun facts about Aleppo!</p>
            <p className="text-brown-light text-sm font-arabic-classic mt-1">تعلم حقائق ممتعة عن حلب!</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
