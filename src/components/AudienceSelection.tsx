'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore, AudienceType } from '@/store/gameStore';
import { translations } from '@/lib/translations';

export default function AudienceSelection() {
  const { language, setAudience } = useGameStore();
  const t = translations[language || 'en'];
  const isRTL = language === 'ar';

  const handleAudienceSelect = (audience: AudienceType) => {
    setAudience(audience);
  };

  return (
    <div className="game-container relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Corner Decorations */}
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-right" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-right" />

      <motion.div
        initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="game-card"
      >
        <div className={`card-padding text-center ${isRTL ? 'font-arabic' : ''}`}>
          {/* Header Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-4"
          >
            <Image
              src="/icon-gamepad.png"
              alt=""
              width={60}
              height={60}
              className="mx-auto"
            />
          </motion.div>

          <div className="divider-gold" />

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="title-main mb-6"
          >
            {t.whoIsPlaying}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAudienceSelect('kids')}
              className="audience-card"
            >
              <Image
                src="/icon-kids.png"
                alt=""
                width={80}
                height={80}
                className="audience-card-icon"
              />
              <span className="text-lg font-bold text-brown-dark">{t.kids}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAudienceSelect('adults')}
              className="audience-card"
            >
              <Image
                src="/icon-family.png"
                alt=""
                width={80}
                height={80}
                className="audience-card-icon"
              />
              <span className="text-lg font-bold text-brown-dark">{t.adults}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
