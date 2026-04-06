import React, { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';

interface LogicGridProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const GRID_SIZE = 3;

const LogicGrid: React.FC<LogicGridProps> = ({ onGameOver, onExit }) => {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<boolean[]>(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds total
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver((level - 1) * 200 + Math.max(0, 100 - moves));
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, level, moves]);

  // Toggle logic
  const toggleNode = useCallback((index: number, currentGrid: boolean[]) => {
    const newGrid = [...currentGrid];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    const toggle = (r: number, c: number) => {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        const i = r * GRID_SIZE + c;
        newGrid[i] = !newGrid[i];
      }
    };

    toggle(row, col);     // Self
    toggle(row - 1, col); // Up
    toggle(row + 1, col); // Down
    toggle(row, col - 1); // Left
    toggle(row, col + 1); // Right

    return newGrid;
  }, []);

  // Generate Level
  const generateLevel = useCallback(() => {
    // Start with solved state (all true)
    let newGrid = Array(GRID_SIZE * GRID_SIZE).fill(true);
    
    // Reverse engineer puzzle by making random valid moves
    // Difficulty increases with level
    const scrambleMoves = level + 3;
    let lastMove = -1;

    for (let i = 0; i < scrambleMoves; i++) {
      let randomIdx;
      do {
        randomIdx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      } while (randomIdx === lastMove); // Prevent immediate undo
      
      newGrid = toggleNode(randomIdx, newGrid);
      lastMove = randomIdx;
    }

    setGrid(newGrid);
    setIsTransitioning(false);
  }, [level, toggleNode]);

  // Initial Load
  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  const handleNodeClick = (index: number) => {
    if (isTransitioning) return;
    
    setGrid(prev => {
      const newGrid = toggleNode(index, prev);
      
      // Check Win Condition immediately after update
      const allActive = newGrid.every(cell => cell === true);
      
      if (allActive) {
        setIsTransitioning(true);
        setTimeout(() => {
          setLevel(l => l + 1);
          // Add bonus time
          setTimeLeft(t => t + 15);
        }, 500);
      }
      
      return newGrid;
    });
    setMoves(m => m + 1);
  };

  return (
    <GameShell
      title="Rede Neural"
      description="Ative todos os nós. Clicar em um nó inverte seus vizinhos."
      score={(level - 1) * 100}
      timeLeft={timeLeft}
      onExit={onExit}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-12">
        
        <div 
          className={`grid gap-4 transition-all duration-500 p-6 glass-panel rounded-[40px] border-white/5 ${
            isTransitioning ? 'opacity-0 scale-90 blur-md' : 'opacity-100 scale-100 blur-0'
          }`}
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1/1'
          }}
        >
          {grid.map((isActive, i) => (
            <button
              key={i}
              onClick={() => handleNodeClick(i)}
              disabled={isTransitioning}
              className={`
                relative rounded-2xl transition-all duration-500 border
                ${isActive 
                  ? 'bg-accent border-accent/50 shadow-[0_0_30px_rgba(236,72,153,0.4)] scale-100' 
                  : 'bg-white/5 border-white/10 scale-[0.98] hover:bg-white/10 hover:border-white/20'}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
              )}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/50 animate-ping" />
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Nível</span>
              <span className="text-2xl font-black text-white">{level}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Movimentos</span>
              <span className="text-2xl font-black text-white">{moves}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-accent font-bold animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            Sincronização Neural Ativa
          </div>
        </div>

      </div>
    </GameShell>
  );
};

export default LogicGrid;