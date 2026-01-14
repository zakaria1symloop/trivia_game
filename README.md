# ALEPPO - Discover the Ancient City

An interactive trivia game celebrating the rich heritage, cuisine, culture, and history of Aleppo, Syria. Built for restaurants and cultural centers to educate and entertain guests while they wait.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)

## Features

### Multi-Language Support
- **English** and **Arabic** with full RTL (Right-to-Left) support
- Seamless language switching

### Audience Modes
- **Kids Mode** - Simple questions with fun facts for children aged 6-12
- **Adults Mode** - More detailed questions with in-depth information

### Seven Categories
| Category | Description |
|----------|-------------|
| Food | Discover Aleppo's famous cuisine - kibbeh Halabiya, kebab Halabi, muhammara |
| Sweets | Learn about Aleppian desserts - mamouniyeh, sbiseh, halawet el jibn |
| Culture | Explore traditions, crafts like soap-making and textile weaving |
| History | Journey through the ancient Citadel, Great Mosque, and Silk Road |
| Spices | Discover Aleppo pepper, za'atar, and the historic spice markets |
| Religion | Learn about Islamic traditions, mosques, and spiritual heritage |
| Mixed | A delightful mix of all categories |

### Four Question Types
Keep users engaged with varied gameplay:

1. **Standard** - Classic multiple choice with 4 options
2. **Flip Card** - Tap to flip and reveal answers (3D animation)
3. **True/False** - Elegant statement-based questions
4. **Speed Round** - Race against the clock with a countdown timer

### Visual Features
- Middle Eastern/Islamic aesthetic design
- Floating eastern particles (stars, crescents, diamonds)
- Golden confetti celebrations for correct answers
- Smooth animations powered by Framer Motion
- Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **AI Questions:** OpenAI GPT-4o-mini
- **Effects:** Canvas Confetti
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/zakaria1symloop/trivia_game.git

# Navigate to project directory
cd trivia_game

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── questions/      # AI-powered question generation
│   ├── globals.css         # Global styles and theme
│   ├── layout.tsx          # Root layout with fonts
│   └── page.tsx            # Main game page
├── components/
│   ├── questions/          # Question type components
│   │   ├── FlipCardQuestion.tsx
│   │   ├── SpeedRoundQuestion.tsx
│   │   └── TrueFalseQuestion.tsx
│   ├── AnimatedBackground.tsx
│   ├── AudienceSelection.tsx
│   ├── CategorySelection.tsx
│   ├── EasternParticles.tsx
│   ├── GameOver.tsx
│   ├── LanguageSelection.tsx
│   └── TriviaGame.tsx      # Main game logic
├── lib/
│   └── translations.ts     # i18n translations
└── store/
    └── gameStore.ts        # Zustand state management
```

## Game Flow

```
┌─────────────────────┐
│  Language Selection │
│   (English/Arabic)  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Audience Selection │
│    (Kids/Adults)    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Category Selection │
│   (7 categories)    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│    Trivia Game      │
│  (10 questions)     │
│  - Standard         │
│  - Flip Card        │
│  - True/False       │
│  - Speed Round      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│     Game Over       │
│  (Score & Options)  │
└─────────────────────┘
```

## Content Guidelines

This game is designed for a family-friendly restaurant environment:

- **Halal Only** - No pork, alcohol, or haram content
- **No Politics** - No war, government, or controversial topics
- **Positive Focus** - Celebrates Aleppo's beautiful heritage
- **Educational** - Fun facts with every question

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy

### Other Platforms

The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## Customization

### Changing the Theme

Edit `src/app/globals.css` to modify:
- Color scheme (gold, brown, cream palette)
- Fonts (Amiri, Tajawal, Scheherazade)
- Corner decorations
- Pattern overlays

### Adding Categories

1. Update `categoryPrompts` in `src/app/api/questions/route.ts`
2. Add translations in `src/lib/translations.ts`
3. Add icon in `public/` directory
4. Update `CategorySelection.tsx`

### Modifying Question Types

Question type assignment is in `TriviaGame.tsx` in the `assignQuestionTypes` function.

## Screenshots

| Language Selection | Category Selection | Trivia Game |
|---|---|---|
| Choose English or Arabic | Pick a topic | Answer questions |

| Flip Card | True/False | Speed Round |
|---|---|---|
| Tap to reveal | Statement-based | Beat the clock |

## License

MIT License - Feel free to use and modify for your restaurant or cultural center.

## Credits

- Built with love for Aleppo's rich heritage
- AI-powered by OpenAI
- Developed by [zakaria1symloop](https://github.com/zakaria1symloop)

---

**ALEPPO** - Celebrating the ancient city's food, culture, and traditions.
