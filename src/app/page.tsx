'use client';

import { useGameStore } from '@/store/gameStore';
import LanguageSelection from '@/components/LanguageSelection';
import AudienceSelection from '@/components/AudienceSelection';
import CategorySelection from '@/components/CategorySelection';
import TriviaGame from '@/components/TriviaGame';
import GameOver from '@/components/GameOver';
import EasternParticles from '@/components/EasternParticles';

export default function Home() {
  const { language, audience, category, gameStarted, questions, currentQuestionIndex } = useGameStore();

  // Determine which screen to show
  const renderScreen = () => {
    // Step 1: Language selection
    if (!language) {
      return <LanguageSelection />;
    }

    // Step 2: Audience selection (kids/adults)
    if (!audience) {
      return <AudienceSelection />;
    }

    // Step 3: Category selection
    if (!category || (!gameStarted && questions.length === 0)) {
      return <CategorySelection />;
    }

    // Step 4: Game is over
    if (gameStarted && questions.length > 0 && currentQuestionIndex >= questions.length) {
      return <GameOver />;
    }

    // Step 5: Playing the game
    if (gameStarted) {
      return <TriviaGame />;
    }

    // Fallback to category selection
    return <CategorySelection />;
  };

  return (
    <main className="min-h-screen">
      <EasternParticles />
      {renderScreen()}
    </main>
  );
}
