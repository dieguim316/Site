import React from 'react';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';

interface GameShellProps {
  title: string;
  description: string;
  score: number;
  timeLeft?: number;
  onExit: () => void;
  children: React.ReactNode;
}

const GameShell: React.FC<GameShellProps> = ({ 
  title, 
  description, 
  score, 
  timeLeft, 
  onExit, 
  children 
}) => {
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <button 
          onClick={onExit}
          className="group flex items-center gap-2 p-2 rounded-full hover:bg-white/5 transition-all duration-300"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </div>
          <span className="hidden sm:inline text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">Sair</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            {title}
          </h1>
          <p className="hidden sm:block text-xs uppercase tracking-[0.2em] text-primary/60 font-semibold mt-1">NeuroPulse Training</p>
        </div>

        <div className="w-10 sm:w-20" /> {/* Spacer to balance the "Sair" button */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="glass-panel p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center justify-between px-4 md:px-8">
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Pontuação</span>
              <div className="flex items-center gap-2 md:gap-3">
                <Trophy className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span className="font-mono text-xl md:text-2xl font-bold text-white leading-none">{score}</span>
              </div>
            </div>
          </div>

          {timeLeft !== undefined && (
            <div className="glass-panel p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center justify-between px-4 md:px-8">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Tempo</span>
                <div className="flex items-center gap-2 md:gap-3">
                  <Timer className={`w-3 h-3 md:w-4 md:h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                  <span className={`font-mono text-xl md:text-2xl font-bold leading-none ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="flex-1 relative flex flex-col justify-center items-center glass-panel rounded-3xl md:rounded-[40px] p-4 md:p-8 overflow-hidden border border-white/5">
          <div className="absolute top-4 md:top-8 left-0 right-0 px-4 md:px-8 text-center">
            <p className="text-xs md:text-sm text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="w-full h-full flex items-center justify-center mt-8 md:mt-8">
            {children}
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-20 -left-20 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-48 md:w-64 h-48 md:h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default GameShell;