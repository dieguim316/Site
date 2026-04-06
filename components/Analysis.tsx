import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, Brain, Target, Lightbulb } from 'lucide-react';
import { generateCognitiveAnalysis } from '../services/geminiService';
import { AnalysisData, GameResult } from '../types';

interface AnalysisProps {
  history: GameResult[];
  onBack: () => void;
}

const Analysis: React.FC<AnalysisProps> = ({ history, onBack }) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // Get last 5 games
      const recent = history.slice(-5);
      const result = await generateCognitiveAnalysis(recent);
      setData(result);
      setLoading(false);
    };
    fetchAnalysis();
  }, [history]);

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="mb-6 p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-gray-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent mb-2">
          Neuro Insights AI
        </h1>
        <p className="text-gray-400">Análise profunda do seu desempenho cognitivo recente</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-accent w-6 h-6 animate-pulse" />
          </div>
          <p className="text-gray-400 animate-pulse">Processando padrões neurais...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Main Summary Card */}
          <div className="bg-gradient-to-br from-surface to-background border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Resumo de Desempenho</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{data.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-surface/50 border border-success/20 p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute -right-4 -top-4 bg-success/10 w-24 h-24 rounded-full blur-2xl"></div>
               <div className="flex items-center gap-3 mb-4">
                 <Target className="w-6 h-6 text-success" />
                 <h4 className="font-bold text-success">Ponto Forte</h4>
               </div>
               <p className="text-2xl font-bold text-white">{data.strength}</p>
            </div>

            {/* Weaknesses */}
            <div className="bg-surface/50 border border-warning/20 p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute -right-4 -top-4 bg-warning/10 w-24 h-24 rounded-full blur-2xl"></div>
               <div className="flex items-center gap-3 mb-4">
                 <Target className="w-6 h-6 text-warning" />
                 <h4 className="font-bold text-warning">A Melhorar</h4>
               </div>
               <p className="text-2xl font-bold text-white">{data.weakness}</p>
            </div>
          </div>

          {/* Coach Tip */}
          <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-accent" />
              <h4 className="font-bold text-accent">Dica do Treinador</h4>
            </div>
            <p className="text-white italic">"{data.tip}"</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-400">
          Erro ao gerar análise. Tente novamente mais tarde.
        </div>
      )}
    </div>
  );
};

export default Analysis;