import { GoogleGenAI, Type } from "@google/genai";
import { GameResult, GameType } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize safe AI instance
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCognitiveAnalysis = async (recentResults: GameResult[]) => {
  if (!ai) {
    return {
      summary: "Conecte sua API Key para obter insights detalhados baseados em IA sobre seu desempenho.",
      tip: "A consistência é a chave para o treinamento cerebral.",
      strength: "Dedicação",
      weakness: "Dados insuficientes"
    };
  }

  // Formatting data for the prompt
  const resultsString = recentResults.map(r => 
    `${r.gameType}: ${r.score} points`
  ).join('\n');

  const prompt = `
    Atue como um neurocientista cognitivo sênior e treinador pessoal.
    O usuário acabou de completar uma sessão de treinamento cerebral com os seguintes resultados:
    ${resultsString}
    
    Forneça uma análise curta, motivadora e científica.
    
    Retorne a resposta EXATAMENTE neste formato JSON:
    {
      "summary": "Uma frase resumindo o desempenho geral e estado mental inferido.",
      "tip": "Uma dica prática e acionável baseada em neurociência para melhorar a área mais fraca.",
      "strength": "Uma ou duas palavras definindo o ponto forte hoje (ex: Memória Visual)",
      "weakness": "Uma ou duas palavras definindo a área a melhorar (ex: Controle Inibitório)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tip: { type: Type.STRING },
            strength: { type: Type.STRING },
            weakness: { type: Type.STRING },
          },
          required: ["summary", "tip", "strength", "weakness"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text response");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Ótimo treino! Continue desafiando seu cérebro diariamente para ver melhorias a longo prazo.",
      tip: "Tente praticar em horários diferentes do dia para testar seu pico de atenção.",
      strength: "Consistência",
      weakness: "N/A"
    };
  }
};

export const chatWithAICoach = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], userStats: any) => {
  if (!ai) {
    return "Conecte sua API Key para conversar com o treinador de IA.";
  }

  const statsString = `
    Estatísticas do Usuário:
    Total de Jogos: ${userStats.totalGames}
    Sequência Atual: ${userStats.streak} dias
    Pontuações por Categoria (0-100):
    - Memória: ${userStats.categoryScores[GameType.MEMORY]}
    - Foco: ${userStats.categoryScores[GameType.FOCUS]}
    - Lógica: ${userStats.categoryScores[GameType.LOGIC]}
    - Matemática: ${userStats.categoryScores[GameType.MATH]}
  `;

  const systemInstruction = `
    Você é um treinador cognitivo de IA especializado em neurociência e treinamento cerebral.
    O usuário está usando o aplicativo NeuroPulse.
    Seu objetivo é ajudar o usuário a melhorar suas habilidades cognitivas, responder perguntas sobre o cérebro, dar dicas de estudo e analisar o desempenho dele.
    Seja encorajador, científico, claro e conciso.
    Aqui estão as estatísticas atuais do usuário para contexto:
    ${statsString}
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
      }
    });

    const fullMessage = history.length > 0 
      ? `Histórico da conversa:\n${history.map(h => `${h.role === 'user' ? 'Usuário' : 'Treinador'}: ${h.parts[0].text}`).join('\n')}\n\nUsuário: ${message}`
      : message;

    const response = await chat.sendMessage({ message: fullMessage });
    return response.text || "Desculpe, não consegui processar sua mensagem.";
  } catch (error) {
    console.error("Gemini Chat Failed:", error);
    return "Desculpe, ocorreu um erro ao conectar com o treinador de IA.";
  }
};

export const getDailyTip = async (userStats: any) => {
  if (!ai) {
    return "Conecte sua API Key para receber dicas diárias da IA.";
  }

  const statsString = `
    Total de Jogos: ${userStats.totalGames}
    Sequência: ${userStats.streak} dias
    Pontuações: Memória (${userStats.categoryScores[GameType.MEMORY]}), Foco (${userStats.categoryScores[GameType.FOCUS]}), Lógica (${userStats.categoryScores[GameType.LOGIC]}), Matemática (${userStats.categoryScores[GameType.MATH]})
  `;

  const prompt = `
    Como um neurocientista, dê uma dica curta (máximo 2 frases) e motivadora para o usuário melhorar seu desempenho cognitivo hoje.
    Baseie-se nestas estatísticas: ${statsString}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Continue treinando para manter seu cérebro afiado!";
  } catch (error) {
    console.error("Gemini Daily Tip Failed:", error);
    return "Continue treinando para manter seu cérebro afiado!";
  }
};