'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/store/gameStore';

interface TrueFalseQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isRTL: boolean;
  translations: {
    trueText: string;
    falseText: string;
    correct: string;
    incorrect: string;
  };
}

export default function TrueFalseQuestion({ question, onAnswer, isRTL, translations }: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === question.correctIndex;
    onAnswer(isCorrect);
  };

  const getButtonStyle = (index: number, isTrue: boolean) => {
    const baseGradient = isTrue
      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

    const selectedGradient = isTrue
      ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
      : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)';

    if (showResult) {
      if (index === question.correctIndex) {
        return {
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          transform: 'scale(1.05)',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
        };
      } else if (index === selectedAnswer) {
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          opacity: 0.7,
        };
      }
      return { opacity: 0.5 };
    }

    return {
      background: baseGradient,
    };
  };

  return (
    <div className="true-false-container">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="question-box"
        style={{
          marginBottom: '24px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📜</div>
        <h3
          className={`text-base font-bold text-brown-dark ${isRTL ? 'font-arabic' : ''}`}
          style={{ lineHeight: '1.6' }}
        >
          {question.question}
        </h3>
      </motion.div>

      {/* True/False Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* True Button */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={!showResult ? { scale: 1.03 } : {}}
          whileTap={!showResult ? { scale: 0.97 } : {}}
          onClick={() => handleAnswer(0)}
          disabled={showResult}
          style={{
            ...getButtonStyle(0, true),
            borderRadius: '16px',
            padding: '24px 16px',
            border: 'none',
            cursor: showResult ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <motion.div
            animate={!showResult ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '36px', marginBottom: '8px' }}
          >
            ✓
          </motion.div>
          <span
            className={`font-bold text-white text-lg ${isRTL ? 'font-arabic' : ''}`}
          >
            {translations.trueText}
          </span>
        </motion.button>

        {/* False Button */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={!showResult ? { scale: 1.03 } : {}}
          whileTap={!showResult ? { scale: 0.97 } : {}}
          onClick={() => handleAnswer(1)}
          disabled={showResult}
          style={{
            ...getButtonStyle(1, false),
            borderRadius: '16px',
            padding: '24px 16px',
            border: 'none',
            cursor: showResult ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <motion.div
            animate={!showResult ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{ fontSize: '36px', marginBottom: '8px' }}
          >
            ✗
          </motion.div>
          <span
            className={`font-bold text-white text-lg ${isRTL ? 'font-arabic' : ''}`}
          >
            {translations.falseText}
          </span>
        </motion.button>
      </div>

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center mt-6 text-xl font-bold ${
            selectedAnswer === question.correctIndex ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {selectedAnswer === question.correctIndex ? translations.correct : translations.incorrect}
        </motion.div>
      )}
    </div>
  );
}
