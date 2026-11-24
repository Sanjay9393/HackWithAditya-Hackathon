import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  User,
  CheckCircle2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
  confidenceNote?: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { user, t, language, setLanguage } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: language === 'te'
        ? "నమస్కారం! నేను ప్రజా ఏఐ (PrajaAI) - మీ చందానగర్ గ్రామ డిజిటల్ సహాయకుడిని. గ్రామాభివృద్ధి పనులు, ప్రభుత్వ సంక్షేమ పథకాలు (పీఎం-కిసాన్, రైతు భరోసా, ఆరోగ్యశ్రీ), ఫిర్యాదులు లేదా సేవా కేంద్రాల గురించి నన్ను అడగవచ్చు."
        : "Hello! I am PrajaAI, your Chandanagar Gram Panchayat AI Assistant. You can ask me about ongoing village development projects, government schemes (PM-Kisan, Rythu Bharosa, Aarogyasri), civic issues, or public services in Telugu or English.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { en: "What development works are happening in my village?", te: "మా గ్రామంలో ఏ అభివృద్ధి పనులు జరుగుతున్నాయి?" },
    { en: "What is the budget for road construction?", te: "రోడ్డు నిర్మాణానికి ఎంత బడ్జెట్ మంజూరైంది?" },
    { en: "Which government schemes are available for farmers?", te: "రైతులకు ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి?" },
    { en: "How do I apply for Rythu Bharosa and what documents are needed?", te: "రైతు భరోసాకు ఏ పత్రాలు అవసరం?" },
    { en: "When is the next Gram Sabha meeting?", te: "తదుపరి గ్రామసభ ఎప్పుడు జరుగుతుంది?" },
    { en: "Where is the Primary Health Sub-Centre?", te: "ప్రాథమిక ఆరోగ్య ఉపకేంద్రం ఎక్కడ ఉంది?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Web Speech API: Speech-to-Text
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Web Speech API: Text-to-Speech
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || input;
    if (!msgText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: msgText,
        language: language
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.reply,
        citations: res.data.citations,
        confidenceNote: res.data.confidence_note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered a temporary connection issue. Please verify your query or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#166534] text-white rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {t("PrajaAI Village Assistant", "ప్రజా ఏఐ గ్రామ డిజిటల్ సహాయకుడు")}
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              RAG Grounded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              "Grounded strictly in Chandanagar Gram Panchayat records and official government guidelines. Supports English and Telugu.",
              "చందానగర్ గ్రామ అధికారిక రికార్డులు మరియు ప్రభుత్వ నిబంధనల ఆధారంగా ఖచ్చితమైన సమాధానాలు."
            )}
          </p>
        </div>

        {/* Clear and language buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 border border-slate-200 px-2.5 py-1.5 rounded-lg bg-white shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t("Clear Chat", "క్లియర్")}
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          💡 {t("Try asking:", "అడగండి:")}
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(language === 'te' ? p.te : p.en)}
            className="text-xs bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {language === 'te' ? p.te : p.en}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card padding={false} className="h-[480px] flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-[#166534] text-white rounded-br-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Grounded Citations if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      📚 {t("Verified Citations:", "ధృవీకరించిన సమాచార మూలాలు:")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c: any, i: number) => (
                        <Link
                          key={i}
                          to={c.link || '#'}
                          className="inline-flex items-center gap-1 text-[11px] bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 px-2 py-0.5 rounded font-medium shadow-2xs"
                        >
                          <span>{c.title}</span>
                          <span className="text-[9px] text-slate-400">({c.type})</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer timestamp & listen button */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeakText(msg.content)}
                      className="hover:text-[#166534] flex items-center gap-1 ml-2 text-slate-500"
                      title="Listen to this response"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? t("Stop", "ఆపు") : t("Listen", "వినండి")}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {user ? user.full_name[0] : 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>{t("Searching verified village records & synthesizing answer...", "గ్రామ రికార్డులను పరిశీలిస్తోంది...")}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-colors ${
                isListening
                  ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isListening ? "Listening... click to stop" : "Speak your query (Speech to Text)"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? t("Listening to your voice...", "మీ స్వరాన్ని రికార్డ్ చేస్తోంది...")
                  : t("Ask anything in Telugu or English (e.g. CC Road budget, Rythu Bharosa criteria)...", "తెలుగు లేదా ఇంగ్లీష్‌లో ప్రశ్న అడగండి...")
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />

            <Button
              type="submit"
              disabled={!input.trim() || loading}
              size="md"
              icon={<Send className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">{t("Ask", "అడుగు")}</span>
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            {t(
              "PrajaAI does not hallucinate unofficial promises. All answers cite verified Gram Panchayat files.",
              "ప్రజా ఏఐ ధృవీకరించిన గ్రామ రికార్డుల ఆధారంగా మాత్రమే సమాచారం అందిస్తుంది."
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};
