import React, { useEffect, useState } from 'react';
import { Play, Brain, Zap, Hash, Activity, Workflow, MessageSquare, Sparkles } from 'lucide-react';
import { GameType, UserStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getDailyTip } from '../services/geminiService';

interface DashboardProps {
  onSelectGame: (type: GameType) => void;
  stats: UserStats;
  onAnalyze: () => void;
  onChat: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectGame, stats, onAnalyze, onChat }) => {
  const [dailyTip, setDailyTip] = useState<string>("Carregando dica do dia...");

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getDailyTip(stats);
      setDailyTip(tip);
    };
    fetchTip();
  }, [stats]);

  const chartData = [
    { name: 'Memória', score: stats.categoryScores[GameType.MEMORY] || 0, color: '#ff4e00' },
    { name: 'Foco', score: stats.categoryScores[GameType.FOCUS] || 0, color: '#10b981' },
    { name: 'Lógica', score: stats.categoryScores[GameType.LOGIC] || 0, color: '#ff8c00' },
    { name: 'Math', score: stats.categoryScores[GameType.MATH] || 0, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
            <div className="w-8 h-[1px] bg-primary"></div>
            Bem-vindo ao NeuroPulse
          </div>
          <h1 className="text-5xl font-bold text-gradient tracking-tight">
            Olá, Atleta Mental
          </h1>
          <p className="text-gray-500 font-medium text-lg">Seu cérebro está pronto para o próximo nível?</p>
        </div>
        
        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4 border-white/10">
          <div className="p-2 bg-accent/20 rounded-xl">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sequência</span>
            <span className="font-bold text-white text-lg">{stats.streak} dias</span>
          </div>
        </div>
      </div>

      {/* Main Stats & AI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cognitive Profile Card */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-[40px] relative overflow-hidden group border-white/5">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Perfil Cognitivo</h2>
              <p className="text-sm text-gray-500 font-medium">Análise em tempo real das suas habilidades</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 5, 2, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 8 }}
                />
                <Bar 
                  dataKey="score" 
                  radius={[12, 12, 12, 12]} 
                  barSize={40}
                  fill="url(#barGradient)"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4e00" />
                    <stop offset="100%" stopColor="#ff8c00" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={onAnalyze}
              className="flex-1 py-4 glass-card rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
            >
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              Análise Profunda com IA
            </button>
            <button 
              onClick={onChat}
              className="flex-1 py-4 bg-primary hover:bg-primary/90 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
            >
              <div className="p-1.5 bg-white/20 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              Conversar com o Treinador
            </button>
          </div>
        </div>

        {/* Side Stats & Tips */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[40px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total de Sessões</span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-white tracking-tighter">{stats.totalGames}</span>
              <span className="text-primary font-bold text-sm">treinos</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 mt-6 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent w-[75%] rounded-full" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-8 rounded-[40px] border border-white/5 flex flex-col justify-center relative overflow-hidden flex-1 group">
            <div className="absolute -right-8 -top-8 bg-primary/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">Insight do Dia</span>
            </div>
            <p className="text-base text-gray-300 leading-relaxed z-10 font-medium italic">
              "{dailyTip}"
            </p>
          </div>
        </div>
      </div>

      {/* Training Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white tracking-tight">Módulos de Treinamento</h3>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">4 Módulos Ativos</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrainingCard 
            title="Matriz de Memória"
            category="Memória Visual"
            icon={<Brain className="w-6 h-6" />}
            color="primary"
            onClick={() => onSelectGame(GameType.MEMORY)}
          />
          <TrainingCard 
            title="Conflito de Cores"
            category="Controle Inibitório"
            icon={<Zap className="w-6 h-6" />}
            color="success"
            onClick={() => onSelectGame(GameType.FOCUS)}
          />
          <TrainingCard 
            title="Matemática Rápida"
            category="Agilidade Mental"
            icon={<Hash className="w-6 h-6" />}
            color="warning"
            onClick={() => onSelectGame(GameType.MATH)}
          />
          <TrainingCard 
            title="Rede Neural"
            category="Raciocínio Lógico"
            icon={<Workflow className="w-6 h-6" />}
            color="accent"
            onClick={() => onSelectGame(GameType.LOGIC)}
          />
        </div>
      </div>
    </div>
  );
};

interface TrainingCardProps {
  title: string;
  category: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'accent';
  onClick: () => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ title, category, icon, color, onClick }) => {
  const colorMap = {
    primary: 'text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white',
    success: 'text-success bg-success/10 group-hover:bg-success group-hover:text-white',
    warning: 'text-warning bg-warning/10 group-hover:bg-warning group-hover:text-white',
    accent: 'text-accent bg-accent/10 group-hover:bg-accent group-hover:text-white',
  };

  const borderMap = {
    primary: 'hover:border-primary/30',
    success: 'hover:border-success/30',
    warning: 'hover:border-warning/30',
    accent: 'hover:border-accent/30',
  };

  return (
    <button 
      onClick={onClick}
      className={`group relative overflow-hidden glass-card p-8 rounded-[32px] border border-white/5 transition-all duration-500 hover:scale-[1.05] text-left flex flex-col items-start ${borderMap[color]}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${colorMap[color]}`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{category}</p>
      
      <div className="absolute bottom-6 right-6 p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
        <Play className="w-4 h-4 text-white fill-white" />
      </div>
    </button>
  );
};

export default Dashboard;