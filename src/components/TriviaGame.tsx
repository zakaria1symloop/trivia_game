'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useGameStore, QuestionType } from '@/store/gameStore';
import { translations } from '@/lib/translations';
import FlipCardQuestion from './questions/FlipCardQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import SpeedRoundQuestion from './questions/SpeedRoundQuestion';

export default function TriviaGame() {
  const {
    language,
    audience,
    category,
    questions,
    currentQuestionIndex,
    score,
    isLoading,
    setQuestions,
    answerQuestion,
    nextQuestion,
    setLoading,
  } = useGameStore();

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const t = translations[language || 'en'];
  const isRTL = language === 'ar';

  const currentQuestion = questions[currentQuestionIndex];

  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
      colors: ['#C9A227', '#D4AF37', '#E8D5A3', '#FFD700', '#FFA500'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, audience, language, count: 10 }),
        });

        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        // Assign question types to create variety
        const questionsWithTypes = assignQuestionTypes(data.questions);
        setQuestions(questionsWithTypes);
      } catch (error) {
        console.error('Error fetching questions:', error);
        const fallback = getFallbackQuestions(language || 'en');
        setQuestions(assignQuestionTypes(fallback));
      } finally {
        setLoading(false);
      }
    };

    if (isLoading && questions.length === 0) {
      fetchQuestions();
    }
  }, [isLoading, questions.length, category, audience, language, setQuestions, setLoading]);

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setShowResult(true);
    answerQuestion(correct);
    if (correct) fireConfetti();
  };

  const handleNextQuestion = () => {
    setShowTransition(true);
    setTimeout(() => {
      setShowResult(false);
      setIsCorrect(false);
      nextQuestion();
      setShowTransition(false);
    }, 300);
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="game-container relative" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="game-card" style={{ maxWidth: '320px' }}>
          <div className={`p-8 ${isRTL ? 'font-arabic' : ''}`}>
            <div className="flex flex-col items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ marginBottom: '24px' }}
              >
                <Image src="/icon-mixed.png" alt="" width={64} height={64} />
              </motion.div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-brown-dark font-bold text-lg text-center"
                style={{ marginBottom: '20px' }}
              >
                {language === 'ar' ? 'جاري تحضير الأسئلة...' : 'Preparing your questions...'}
              </motion.p>

              <div className="flex justify-center" style={{ gap: '12px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 bg-gold rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const questionType = currentQuestion.type || 'standard';

  // Get icon for question type
  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'flipCard': return '🎴';
      case 'trueFalse': return '⚖️';
      case 'speedRound': return '⚡';
      default: return '📝';
    }
  };

  return (
    <div className="game-container relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Corner Decorations */}
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration top-right" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-left" />
      <Image src="/corner-decoration.png" alt="" width={80} height={80} className="corner-decoration bottom-right" />

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: showTransition ? 0 : 1, x: showTransition ? -50 : 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="game-card"
          style={{ maxWidth: '400px' }}
        >
          <div className={isRTL ? 'font-arabic' : ''} style={{ padding: '16px' }}>

            {/* Header - Question number, Type, and Score */}
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span className="text-xs text-brown-light font-semibold">
                  {t.question} {currentQuestionIndex + 1} {t.of} {questions.length}
                </span>
                <span style={{ fontSize: '16px' }}>{getTypeIcon(questionType)}</span>
              </div>
              <span className="score-badge" style={{ padding: '4px 10px', fontSize: '12px' }}>
                {t.score}: {score}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginBottom: '16px', height: '6px' }}>
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            {/* Question Content - Render based on type */}
            {questionType === 'flipCard' && (
              <FlipCardQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isRTL={isRTL}
                translations={{
                  tapToFlip: t.tapToFlip,
                  selectAnswer: t.selectAnswer,
                  correct: t.correct,
                  incorrect: t.incorrect,
                }}
              />
            )}

            {questionType === 'trueFalse' && (
              <TrueFalseQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isRTL={isRTL}
                translations={{
                  trueText: t.trueText,
                  falseText: t.falseText,
                  correct: t.correct,
                  incorrect: t.incorrect,
                }}
              />
            )}

            {questionType === 'speedRound' && (
              <SpeedRoundQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isRTL={isRTL}
                translations={{
                  speedRound: t.speedRound,
                  timeUp: t.timeUp,
                  correct: t.correct,
                  incorrect: t.incorrect,
                  bonusPoints: t.bonusPoints,
                }}
              />
            )}

            {questionType === 'standard' && (
              <StandardQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isRTL={isRTL}
                translations={{
                  correct: t.correct,
                  incorrect: t.incorrect,
                  funFact: t.funFact,
                }}
              />
            )}

            {/* Next Button (shown after answering for all types) */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '16px' }}
              >
                {currentQuestion.funFact && questionType !== 'speedRound' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="fun-fact-box"
                    style={{ marginBottom: '12px', padding: '10px' }}
                  >
                    <p className="font-bold text-gold text-sm" style={{ marginBottom: '4px' }}>{t.funFact}</p>
                    <p className="text-brown-dark text-xs">{currentQuestion.funFact}</p>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextQuestion}
                  className="btn-primary"
                  style={{ padding: '10px 16px', fontSize: '14px' }}
                >
                  {t.nextQuestion}
                </motion.button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Standard Multiple Choice Question Component
function StandardQuestion({
  question,
  onAnswer,
  isRTL,
  translations,
}: {
  question: any;
  onAnswer: (isCorrect: boolean) => void;
  isRTL: boolean;
  translations: { correct: string; incorrect: string; funFact: string };
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === question.correctIndex;
    onAnswer(isCorrect);
  };

  return (
    <>
      {/* Question Box */}
      <div className="question-box" style={{ marginBottom: '16px', padding: '12px' }}>
        <h3 className={`text-sm font-bold text-brown-dark leading-snug ${isRTL ? 'font-arabic' : ''}`}>
          {question.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option: string, index: number) => {
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
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={buttonClass}
              style={{ padding: '10px 14px', fontSize: '13px' }}
            >
              <span className="flex items-center gap-2">
                <span className="option-letter" style={{ width: '26px', height: '26px', minWidth: '26px', fontSize: '12px' }}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-center text-lg font-bold mt-4 ${
            selectedAnswer === question.correctIndex ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {selectedAnswer === question.correctIndex ? translations.correct : translations.incorrect}
        </motion.div>
      )}
    </>
  );
}

// Convert a question + answer into a statement for True/False
function convertToStatement(question: string, answer: string): string {
  // Remove question mark
  let q = question.replace('?', '').trim();

  // Common patterns to convert
  if (q.toLowerCase().startsWith('what is ')) {
    return q.replace(/^what is /i, '') + ' is ' + answer + '.';
  }
  if (q.toLowerCase().startsWith('what are ')) {
    return q.replace(/^what are /i, '') + ' are ' + answer + '.';
  }
  if (q.toLowerCase().startsWith('which ')) {
    return answer + ' ' + q.replace(/^which /i, '').replace(/^[a-z]/, c => c.toLowerCase()) + '.';
  }
  if (q.toLowerCase().startsWith('who ')) {
    return answer + ' ' + q.replace(/^who /i, '').replace(/^[a-z]/, c => c.toLowerCase()) + '.';
  }
  if (q.toLowerCase().startsWith('where ')) {
    return q.replace(/^where /i, '') + ' is in ' + answer + '.';
  }
  if (q.toLowerCase().startsWith('how many ')) {
    return 'There are ' + answer + ' ' + q.replace(/^how many /i, '') + '.';
  }

  // Default: combine question and answer
  return answer + ' - ' + q + '.';
}

// Assign question types to create variety
function assignQuestionTypes(questions: any[]) {
  const types: QuestionType[] = ['standard', 'flipCard', 'trueFalse', 'speedRound'];

  return questions.map((q, index) => {
    // Create a pattern: standard, flipCard, standard, trueFalse, standard, speedRound, repeat
    let type: QuestionType;

    if (index === 0) {
      type = 'standard'; // First question is always standard
    } else if (index === 1 || index === 5) {
      type = 'flipCard';
    } else if (index === 3 || index === 7) {
      type = 'trueFalse';
      // Convert question to a TRUE statement format
      const correctAnswer = q.options[q.correctIndex];
      const statement = convertToStatement(q.question, correctAnswer);
      return {
        ...q,
        type,
        question: statement,
        options: ['True', 'False'],
        correctIndex: 0, // The statement is TRUE
      };
    } else if (index === 4 || index === 8) {
      type = 'speedRound';
      return { ...q, type, timeLimit: 10 };
    } else {
      type = 'standard';
    }

    return { ...q, type };
  });
}

function getFallbackQuestions(language: string) {
  const fallbackEn = [
    { id: 'f1', question: 'Which city is one of the oldest continuously inhabited cities?', options: ['Cairo', 'Damascus', 'Baghdad', 'Jerusalem'], correctIndex: 1, funFact: 'Damascus has been inhabited for over 11,000 years!' },
    { id: 'f2', question: 'What is the main ingredient in hummus?', options: ['Lentils', 'Chickpeas', 'Beans', 'Peas'], correctIndex: 1, funFact: 'Hummus means "chickpeas" in Arabic!' },
    { id: 'f3', question: 'Which sweet is made with layers of filo and honey?', options: ['Kunafa', 'Baklava', 'Maamoul', 'Basbousa'], correctIndex: 1, funFact: 'Baklava is served during celebrations!' },
    { id: 'f4', question: 'What spice blend is common in Middle Eastern cooking?', options: ['Curry', 'Zaatar', 'Garam Masala', 'Herbs de Provence'], correctIndex: 1, funFact: 'Zaatar contains thyme, sesame, sumac, and salt!' },
    { id: 'f5', question: 'What is traditional Arab coffee called?', options: ['Espresso', 'Qahwa', 'Cappuccino', 'Latte'], correctIndex: 1, funFact: 'Qahwa is flavored with cardamom!' },
    { id: 'f6', question: 'Falafel originated in which region?', options: ['South Asia', 'Middle East', 'Europe', 'Africa'], correctIndex: 1, funFact: 'Falafel is believed to have originated in Egypt!' },
    { id: 'f7', question: 'What grain is used to make tabbouleh?', options: ['Rice', 'Bulgur', 'Couscous', 'Quinoa'], correctIndex: 1, funFact: 'Tabbouleh is a Levantine vegetarian salad!' },
    { id: 'f8', question: 'Shawarma is typically served in what?', options: ['Bowl', 'Pita bread', 'Tortilla', 'Rice paper'], correctIndex: 1, funFact: 'Shawarma means "turning" in Arabic!' },
    { id: 'f9', question: 'What is the main ingredient in baba ganoush?', options: ['Tomatoes', 'Eggplant', 'Zucchini', 'Peppers'], correctIndex: 1, funFact: 'Baba ganoush means "pampered papa" in Arabic!' },
    { id: 'f10', question: 'Which spice gives many Middle Eastern dishes their yellow color?', options: ['Paprika', 'Turmeric', 'Cinnamon', 'Cumin'], correctIndex: 1, funFact: 'Turmeric has been used for thousands of years!' },
  ];

  const fallbackAr = [
    { id: 'f1', question: 'ما هي المدينة من أقدم المدن المأهولة باستمرار؟', options: ['القاهرة', 'دمشق', 'بغداد', 'القدس'], correctIndex: 1, funFact: 'دمشق مأهولة منذ أكثر من 11,000 عام!' },
    { id: 'f2', question: 'ما هو المكون الرئيسي في الحمص؟', options: ['العدس', 'الحمص', 'الفول', 'البازلاء'], correctIndex: 1, funFact: 'الحمص يؤكل منذ آلاف السنين!' },
    { id: 'f3', question: 'ما هي الحلوى المصنوعة من الفيلو والعسل؟', options: ['الكنافة', 'البقلاوة', 'المعمول', 'البسبوسة'], correctIndex: 1, funFact: 'البقلاوة تقدم في الاحتفالات!' },
    { id: 'f4', question: 'ما مزيج التوابل الشائع في الشرق الأوسط؟', options: ['الكاري', 'الزعتر', 'غارام ماسالا', 'أعشاب'], correctIndex: 1, funFact: 'الزعتر يحتوي على السمسم والسماق!' },
    { id: 'f5', question: 'ما اسم القهوة العربية؟', options: ['إسبريسو', 'قهوة', 'كابتشينو', 'لاتيه'], correctIndex: 1, funFact: 'القهوة العربية بنكهة الهيل!' },
    { id: 'f6', question: 'من أي منطقة نشأ الفلافل؟', options: ['جنوب آسيا', 'الشرق الأوسط', 'أوروبا', 'أفريقيا'], correctIndex: 1, funFact: 'يُعتقد أن الفلافل نشأ في مصر!' },
    { id: 'f7', question: 'ما الحبوب المستخدمة في التبولة؟', options: ['الأرز', 'البرغل', 'الكسكس', 'الكينوا'], correctIndex: 1, funFact: 'التبولة سلطة نباتية شامية!' },
    { id: 'f8', question: 'الشاورما تُقدم عادة في ماذا؟', options: ['وعاء', 'خبز البيتا', 'التورتيلا', 'ورق الأرز'], correctIndex: 1, funFact: 'شاورما تعني "الدوران" بالعربية!' },
    { id: 'f9', question: 'ما المكون الرئيسي في بابا غنوج؟', options: ['الطماطم', 'الباذنجان', 'الكوسا', 'الفلفل'], correctIndex: 1, funFact: 'بابا غنوج يعني "الأب المدلل"!' },
    { id: 'f10', question: 'أي بهار يعطي اللون الأصفر للأطباق؟', options: ['البابريكا', 'الكركم', 'القرفة', 'الكمون'], correctIndex: 1, funFact: 'الكركم يُستخدم منذ آلاف السنين!' },
  ];

  return language === 'ar' ? fallbackAr : fallbackEn;
}
