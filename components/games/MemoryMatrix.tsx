import React, { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import { GameType } from '../../types';

interface MemoryMatrixProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ onGameOver, onExit }) => {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [targetTiles, setTargetTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'WATCH' | 'RECALL' | 'SUCCESS' | 'FAIL'>('WATCH');
  const [lives, setLives] = useState(3);

  // Generate new level
  const generateLevel = useCallback(() => {
    const totalTiles = gridSize * gridSize;
    const numTargets = Math.min(Math.floor(level / 2) + 2, totalTiles - 1);
    const newTargets = new Set<number>();
    
    while(newTargets.size < numTargets) {
      newTargets.add(Math.floor(Math.random() * totalTiles));
    }
    
    setTargetTiles(Array.from(newTargets));
    setSelectedTiles([]);
    setGameState('WATCH');
  }, [level, gridSize]);

  // Initial load
  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  // Watch timer
  useEffect(() => {
    if (gameState === 'WATCH') {
      const timer = setTimeout(() => {
        setGameState('RECALL');
      }, 1500 + (level * 200)); // More time for higher levels
      return () => clearTimeout(timer);
    }
  }, [gameState, level]);

  const handleTileClick = (index: number) => {
    if (gameState !== 'RECALL') return;

    // Toggle selection
    if (selectedTiles.includes(index)) return; // Can't unselect in this version for simplicity

    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);

    // Check if correct
    if (!targetTiles.includes(index)) {
      // Wrong tile
      setLives(l => l - 1);
      setGameState('FAIL');
      setTimeout(() => {
        if (lives <= 1) {
          onGameOver(level * 100);
        } else {
          // Retry same level or regen? Let's regen to keep it fresh but easier
           generateLevel();
        }
      }, 1000);
    } else {
      // Correct tile check if all found
      const allFound = targetTiles.every(t => newSelected.includes(t));
      if (allFound) {
        setGameState('SUCCESS');
        setTimeout(() => {
          setLevel(l => l + 1);
          if (level % 3 === 0) setGridSize(s => Math.min(s + 1, 6)); // Increase grid size every 3 levels
        }, 1000);
      }
    }
  };
  
  // Effect to trigger next level generation after success delay
  useEffect(() => {
    if (gameState === 'SUCCESS') {
        const timer = setTimeout(() => {
            generateLevel();
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [gameState, generateLevel]);


  return (
    <GameShell
      title="Matriz de Memória"
      description={gameState === 'WATCH' ? "Memorize o padrão em destaque" : "Toque nos quadrados que apareceram"}
      score={level * 100}
      onExit={onExit}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-12">
        <div 
          className="grid gap-3 transition-all duration-500 p-4 glass-panel rounded-[32px] border-white/5"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1/1'
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const isTarget = targetTiles.includes(i);
            const isSelected = selectedTiles.includes(i);
            
            let tileStyle = 'bg-white/5 border-white/5'; // Default
            
            if (gameState === 'WATCH' && isTarget) {
              tileStyle = 'bg-primary shadow-[0_0_30px_rgba(255,78,0,0.4)] scale-[0.98] border-primary/50';
            } else if (gameState === 'RECALL' || gameState === 'SUCCESS' || gameState === 'FAIL') {
               if (isSelected && isTarget) tileStyle = 'bg-success shadow-[0_0_20px_rgba(16,185,129,0.3)] border-success/50';
               else if (isSelected && !isTarget) tileStyle = 'bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)] border-red-500/50 animate-shake';
               else if (gameState === 'FAIL' && isTarget) tileStyle = 'bg-primary/30 border-primary/20'; // Reveal missed
            }

            return (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                disabled={gameState !== 'RECALL'}
                className={`
                  relative rounded-xl transition-all duration-300 border
                  ${tileStyle}
                  ${gameState === 'RECALL' ? 'hover:bg-white/10 hover:border-white/20 active:scale-90 cursor-pointer' : 'cursor-default'}
                `}
              >
                {isSelected && isTarget && (
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Vidas Restantes</span>
          <div className="flex gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i < lives 
                    ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-100' 
                    : 'bg-white/10 scale-75'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default MemoryMatrix;