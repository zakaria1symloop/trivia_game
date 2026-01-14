'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/store/gameStore';

interface SpeedRoundQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isRTL: boolean;
  translations: {
    speedRound: string;
    timeUp: string;
    correct: string;
    incorrect: string;
    bonusPoints: string;
  };
}

export default function SpeedRoundQuestion({ question, onAnswer, isRTL, translations }: SpeedRoundQuestionProps) {
  const timeLimit = question.timeLimit || 10;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(false);

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (showResult || timedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, timedOut]);

  // Handle timeout in a separate effect to avoid setState during render
  useEffect(() => {
    if (timedOut && selectedAnswer === null && !showResult) {
      setShowResult(true);
      onAnswer(false);
    }
  }, [timedOut, selectedAnswer, showResult, onAnswer]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === question.correctIndex;

    // Bonus for fast answers (more than half time remaining)
    if (isCorrect && timeLeft > timeLimit / 2) {
      setBonusEarned(true);
    }

    onAnswer(isCorrect);
  };

  const getTimerColor = () => {
    if (timeLeft > 6) return '#22c55e';
    if (timeLeft > 3) return '#eab308';
    return '#ef4444';
  };

  const progress = (timeLeft / timeLimit) * 100;

  return (
    <div className="speed-round-container">
      {/* Speed Round Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        style={{ marginBottom: '16px' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          ⚡ {translations.speedRound}
        </motion.div>
      </motion.div>

      {/* Circular Timer */}
      <div className="flex justify-center" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={getTimerColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={220}
              animate={{ strokeDashoffset: 220 - (220 * progress) / 100 }}
              transition={{ duration: 0.3 }}
              style={{
                filter: `drop-shadow(0 0 8px ${getTimerColor()})`,
              }}
            />
          </svg>
          <motion.div
            animate={timeLeft <= 3 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              fontWeight: 'bold',
              color: getTimerColor(),
            }}
          >
            {timeLeft}
          </motion.div>
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="question-box"
        style={{
          marginBottom: '16px',
          padding: '14px',
          borderColor: getTimerColor(),
          borderWidth: '2px',
          transition: 'border-color 0.3s ease',
        }}
      >
        <h3
          className={`text-sm font-bold text-brown-dark leading-snug ${isRTL ? 'font-arabic' : ''}`}
        >
          {question.question}
        </h3>
      </motion.div>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {question.options.map((option, index) => {
          let buttonClass = 'option-btn';
          if (showResult) {
            if (index === question.correctIndex) {
              buttonClass += ' correct';
            } else if (index === selectedAnswer) {
              buttonClass += ' incorrect';
            }
          }

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={buttonClass}
              style={{ padding: '10px 14px', fontSize: '13px' }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="option-letter"
                  style={{ width: '24px', height: '24px', minWidth: '24px', fontSize: '11px' }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Result & Bonus */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          style={{ marginTop: '16px' }}
        >
          {timeLeft === 0 && selectedAnswer === null ? (
            <span className="text-red-600 font-bold text-lg">{translations.timeUp}</span>
          ) : (
            <>
              <span
                className={`font-bold text-lg ${
                  selectedAnswer === question.correctIndex ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {selectedAnswer === question.correctIndex ? translations.correct : translations.incorrect}
              </span>
              {bonusEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2"
                >
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    ⚡ {translations.bonusPoints}
                  </span>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
