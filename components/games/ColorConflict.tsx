import React, { useState, useEffect, useRef } from 'react';
import GameShell from '../GameShell';

interface ColorConflictProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const COLORS = [
  { name: 'VERMELHO', hex: '#ef4444' }, // Red
  { name: 'AZUL', hex: '#3b82f6' },     // Blue
  { name: 'VERDE', hex: '#10b981' },    // Green
  { name: 'AMARELO', hex: '#f59e0b' },  // Yellow
];

const ColorConflict: React.FC<ColorConflictProps> = ({ onGameOver, onExit }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [inkColor, setInkColor] = useState(COLORS[1]);
  const [options, setOptions] = useState(COLORS);
  
  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score]);

  const generateRound = () => {
    // Random word
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    // Random ink (usually different from word for Stroop effect)
    let inkIdx = Math.floor(Math.random() * COLORS.length);
    // 30% chance they are the same to trick user
    if (Math.random() > 0.7) {
        inkIdx = wordIdx;
    }
    
    setCurrentWord(COLORS[wordIdx]);
    setInkColor(COLORS[inkIdx]);
    
    // Shuffle options
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (colorHex: string) => {
    // The user must identify the INK COLOR, ignoring the word
    if (colorHex === inkColor.hex) {
      setScore(s => s + 150); // High score for speed
      generateRound();
    } else {
      setScore(s => Math.max(0, s - 50)); // Penalty
      // Optional: shake screen
    }
  };

  return (
    <GameShell
      title="Conflito de Cores"
      description="Selecione a cor da TINTA, ignore a palavra escrita."
      score={score}
      timeLeft={timeLeft}
      onExit={onExit}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 md:gap-16">
        
        {/* The Stimulus */}
        <div className="relative glass-panel p-6 md:p-12 rounded-3xl md:rounded-[40px] border-white/5 w-full max-w-md flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
          <h2 
            className="text-5xl md:text-7xl font-black tracking-tighter transition-all duration-500 scale-100 animate-in zoom-in-95"
            style={{ 
              color: inkColor.hex, 
              filter: `drop-shadow(0 0 20px ${inkColor.hex}44)`,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {currentWord.name}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-md">
          {options.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleAnswer(opt.hex)}
              className="group relative h-16 md:h-20 rounded-2xl glass-card border border-white/5 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
              <span className="relative z-10 font-bold text-base md:text-lg tracking-widest text-white/80 group-hover:text-white transition-colors">
                {opt.name}
              </span>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: opt.hex }}
              />
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
};

export default ColorConflict;