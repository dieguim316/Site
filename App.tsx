import React, { useState } from 'react';
import { GameType, ScreenState, UserStats, GameResult } from './types';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import AICoach from './components/AICoach';
import MemoryMatrix from './components/games/MemoryMatrix';
import ColorConflict from './components/games/ColorConflict';
import QuickMath from './components/games/QuickMath';
import LogicGrid from './components/games/LogicGrid';

const INITIAL_STATS: UserStats = {
  streak: 1,
  totalGames: 0,
  history: [],
  categoryScores: {
    [GameType.MEMORY]: 0,
    [GameType.FOCUS]: 0,
    [GameType.LOGIC]: 0,
    [GameType.MATH]: 0
  }
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.DASHBOARD);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);

  const handleStartGame = (type: GameType) => {
    setSelectedGame(type);
    setCurrentScreen(ScreenState.PLAYING);
  };

  const handleGameOver = (score: number) => {
    if (!selectedGame) return;

    // Update stats
    setUserStats(prev => {
      const newHistory: GameResult = {
        gameType: selectedGame,
        score,
        date: new Date().toISOString()
      };
      
      // Calculate normalized score (simple moving average roughly)
      const currentCatScore = prev.categoryScores[selectedGame];
      // Normalize raw score differently per game
      let normalized = 0;
      if (selectedGame === GameType.MEMORY) normalized = Math.min(100, score / 10); // 1000 pts = 100
      if (selectedGame === GameType.FOCUS) normalized = Math.min(100, score / 20); // 2000 pts = 100
      if (selectedGame === GameType.MATH) normalized = Math.min(100, score / 15);
      if (selectedGame === GameType.LOGIC) normalized = Math.min(100, score / 10); // Approx 1000 pts for high level

      const newCatScore = Math.floor((currentCatScore * 0.7) + (normalized * 0.3));

      return {
        ...prev,
        totalGames: prev.totalGames + 1,
        history: [...prev.history, newHistory],
        categoryScores: {
          ...prev.categoryScores,
          [selectedGame]: newCatScore
        }
      };
    });

    setCurrentScreen(ScreenState.DASHBOARD);
    setSelectedGame(null);
  };

  const handleExitGame = () => {
    setCurrentScreen(ScreenState.DASHBOARD);
    setSelectedGame(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenState.DASHBOARD:
        return (
          <Dashboard 
            onSelectGame={handleStartGame} 
            stats={userStats}
            onAnalyze={() => setCurrentScreen(ScreenState.ANALYSIS)}
            onChat={() => setCurrentScreen(ScreenState.AICOACH)}
          />
        );
      case ScreenState.ANALYSIS:
        return (
          <Analysis 
            history={userStats.history}
            onBack={() => setCurrentScreen(ScreenState.DASHBOARD)}
          />
        );
      case ScreenState.AICOACH:
        return (
          <AICoach 
            stats={userStats}
            onBack={() => setCurrentScreen(ScreenState.DASHBOARD)}
          />
        );
      case ScreenState.PLAYING:
        switch (selectedGame) {
          case GameType.MEMORY:
            return <MemoryMatrix onGameOver={handleGameOver} onExit={handleExitGame} />;
          case GameType.FOCUS:
            return <ColorConflict onGameOver={handleGameOver} onExit={handleExitGame} />;
          case GameType.MATH:
            return <QuickMath onGameOver={handleGameOver} onExit={handleExitGame} />;
          case GameType.LOGIC:
            return <LogicGrid onGameOver={handleGameOver} onExit={handleExitGame} />;
          default:
            return <div>Jogo não encontrado</div>;
        }
      default:
        return <div>Erro</div>;
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-primary selection:text-white relative">
      <div className="atmosphere-bg"></div>
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;