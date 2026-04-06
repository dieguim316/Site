import React, { useState, useEffect } from 'react';
import GameShell from '../GameShell';

interface QuickMathProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const QuickMath: React.FC<QuickMathProps> = ({ onGameOver, onExit }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [expression, setExpression] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score]);

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, ans = 0;

    // Adjust difficulty based on score
    const limit = score > 1000 ? 50 : 20;

    switch(op) {
      case '+':
        a = Math.floor(Math.random() * limit) + 1;
        b = Math.floor(Math.random() * limit) + 1;
        ans = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * limit) + 5;
        b = Math.floor(Math.random() * a); // Ensure positive result
        ans = a - b;
        break;
      case '*':
        a = Math.floor(Math.random() * 12) + 1; // Simple multiplication tables
        b = Math.floor(Math.random() * 9) + 1;
        ans = a * b;
        break;
    }

    setExpression(`${a} ${op} ${b}`);
    setCorrectAnswer(ans);

    // Generate options (1 correct, 3 wrong but close)
    const newOptions = new Set<number>();
    newOptions.add(ans);
    
    while(newOptions.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const val = ans + offset;
      if (val !== ans && val >= 0) newOptions.add(val);
      // Fallback if loop gets stuck (rare for math)
      if(newOptions.size < 4 && Math.random() > 0.9) newOptions.add(Math.floor(Math.random() * 100));
    }

    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (val: number) => {
    if (val === correctAnswer) {
      setScore(s => s + 100);
      generateProblem();
    } else {
        // Penalty but no game over
        setScore(s => Math.max(0, s - 50));
    }
  };

  return (
    <GameShell
      title="Matemática Rápida"
      description="Resolva a equação o mais rápido possível."
      score={score}
      timeLeft={timeLeft}
      onExit={onExit}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 md:gap-16">
        <div className="relative glass-panel p-6 md:p-12 rounded-3xl md:rounded-[40px] border-white/5 w-full max-w-md flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
          <div className="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter animate-in slide-in-from-bottom-4 duration-500">
            {expression} <span className="text-primary">=</span> ?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-md">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="group relative h-20 md:h-24 rounded-2xl glass-card border border-white/5 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
              <span className="relative z-10 font-mono font-bold text-2xl md:text-3xl tracking-tight text-white/80 group-hover:text-white transition-colors">
                {opt}
              </span>
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
};

export default QuickMath;