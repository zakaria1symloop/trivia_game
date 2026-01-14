'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/store/gameStore';

interface FlipCardQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isRTL: boolean;
  translations: {
    tapToFlip: string;
    selectAnswer: string;
    correct: string;
    incorrect: string;
  };
}

export default function FlipCardQuestion({ question, onAnswer, isRTL, translations }: FlipCardQuestionProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === question.correctIndex;
    onAnswer(isCorrect);
  };

  return (
    <div className="flip-card-container" style={{ perspective: '1000px' }}>
      <motion.div
        className="flip-card"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          minHeight: '280px',
        }}
      >
        {/* Front of card - Question */}
        <motion.div
          className="flip-card-front"
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--cream) 0%, var(--gold-pale) 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '3px solid var(--gold)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
          onClick={handleFlip}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              🎴
            </motion.div>
            <h3
              className={`text-lg font-bold text-brown-dark ${isRTL ? 'font-arabic' : ''}`}
              style={{ marginBottom: '20px', lineHeight: '1.5' }}
            >
              {question.question}
            </h3>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gold font-semibold text-sm"
            >
              {translations.tapToFlip}
            </motion.p>
          </div>
        </motion.div>

        {/* Back of card - Answers */}
        <motion.div
          className="flip-card-back"
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, var(--brown-dark) 0%, #2D1810 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '3px solid var(--gold)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <p className="text-gold-light text-center text-sm font-semibold mb-4">
            {translations.selectAnswer}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((option, index) => {
              let bgColor = 'rgba(201, 162, 39, 0.2)';
              let borderColor = 'var(--gold)';

              if (showResult) {
                if (index === question.correctIndex) {
                  bgColor = 'rgba(34, 197, 94, 0.3)';
                  borderColor = '#22c55e';
                } else if (index === selectedAnswer) {
                  bgColor = 'rgba(239, 68, 68, 0.3)';
                  borderColor = '#ef4444';
                }
              }

              return (
                <motion.button
                  key={index}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  style={{
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '10px',
                    padding: '12px 16px',
                    textAlign: isRTL ? 'right' : 'left',
                    color: 'var(--cream)',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ marginRight: isRTL ? '0' : '10px', marginLeft: isRTL ? '10px' : '0' }}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center mt-4 text-lg font-bold ${
                selectedAnswer === question.correctIndex ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {selectedAnswer === question.correctIndex ? translations.correct : translations.incorrect}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
