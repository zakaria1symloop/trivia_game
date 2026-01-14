'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore, Category } from '@/store/gameStore';
import { translations } from '@/lib/translations';

const categories: Category[] = ['food', 'sweets', 'culture', 'history', 'spices', 'religion', 'mixed'];

const categoryIconMap: Record<Category, string> = {
  food: '/icon-food.png',
  sweets: '/icon-sweets.png',
  culture: '/icon-culture.png',
  history: '/icon-history.png',
  spices: '/icon-spices.png',
  religion: '/icon-mosque.png',
  mixed: '/icon-mixed.png',
};

export default function CategorySelection() {
  const { language, category, setCategory, startGame, setLoading } = useGameStore();
  const t = translations[language || 'en'];
  const isRTL = language === 'ar';

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
  };

  const handleStartGame = async () => {
    if (!category) return;
    setLoading(true);
    startGame();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="game-container relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Corner Decorations */}
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-right" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-right" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="game-card"
        style={{ maxWidth: '320px' }}
      >
        <div className={`p-4 ${isRTL ? 'font-arabic' : ''}`}>
          {/* Header */}
          <div className="text-center mb-3">
            <div className="flex justify-center mb-2">
              <Image
                src="/icon-target.png"
                alt=""
                width={36}
                height={36}
              />
            </div>
            <h2 className="text-base font-bold text-brown-dark">{t.selectCategory}</h2>
            <div className="divider-gold my-2" />
          </div>

          {/* Category Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(cat)}
                className={`category-card p-2 ${category === cat ? 'selected' : ''}`}
              >
                <Image
                  src={categoryIconMap[cat]}
                  alt=""
                  width={26}
                  height={26}
                />
                <span className="font-bold text-brown-dark text-[10px] leading-tight mt-1">
                  {t.categories[cat as keyof typeof t.categories]}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: category ? 1 : 0.5 }}
            whileTap={category ? { scale: 0.98 } : {}}
            onClick={handleStartGame}
            disabled={!category}
            className="btn-primary mt-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.startGame}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
