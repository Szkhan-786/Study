
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { createPharmacyChatSession } from '../geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

/**
 * Utility to transform academic AI Markdown output into structured HTML
 * Strips markdown symbols like ### while preserving structure
 */
const formatMessage = (text: string) => {
  if (!text) return '';
  
  return text
    // Handle main headers (completely stripping # symbols)
    .replace(/^#+\s*(.*$)/gim, '<h3 class="font-black text-indigo-700 dark:text-indigo-400 mt-5 mb-2 text-base border-b border-indigo-100 dark:border-indigo-900/40 pb-1 uppercase tracking-tight">$1</h3>')
    // Handle bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    // Handle italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Handle bullet points
    .replace(/^[*-]\s+(.*$)/gim, '<div class="flex gap-2 mb-1.5 ml-1"><span class="text-indigo-500 font-bold leading-tight">•</span><span class="leading-relaxed">$1</span></div>')
    // Handle numbered lists
    .replace(/^(\d+)\.\s+(.*$)/gim, '<div class="flex gap-2 mb-1.5 ml-1 font-medium"><span class="text-indigo-600 dark:text-indigo-400 min-w-[1.2rem]">$1.</span><span class="leading-relaxed">$2</span></div>')
    // Handle LaTeX style arrows
    .replace(/\$\\rightarrow\$/g, '→')
    .replace(/\\rightarrow/g, '→')
    // Handle horizontal lines
    .replace(/^---$/gim, '<hr class="my-5 border-slate-200 dark:border-slate-800" />')
    // Handle links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-indigo-600 dark:text-indigo-400 underline hover:no-underline font-medium">$1</a>')
    // Handle line breaks
    .replace(/\n/g, '<br />');
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your PharmAssistant. How can I help with your B.Pharm studies today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom(isTyping ? 'auto' : 'smooth');
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    if (!chatRef.current) {
      chatRef.current = createPharmacyChatSession();
    }

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: userText });
      let fullText = "";
      
      for await (const chunk of responseStream) {
        const chunkText = (chunk as any).text || "";
        fullText += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          if (newMessages[lastIdx] && newMessages[lastIdx].role === 'model') {
            newMessages[lastIdx].text = fullText;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        if (newMessages[lastIdx] && newMessages[lastIdx].text === '') {
          newMessages[lastIdx].text = "I'm having trouble connecting right now. Please try again later.";
        }
        return newMessages;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => scrollToBottom('auto'), 50);
        }}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] no-print ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <ICONS.Chat className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>

      <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[440px] h-full sm:h-[700px] bg-white dark:bg-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sm:rounded-3xl flex flex-col z-[70] transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        
        <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-lg relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <ICONS.Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">PharmAssistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] opacity-90 uppercase tracking-widest font-black">Professional Academic AI</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ICONS.Close className="w-6 h-6" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950/80 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] p-4 rounded-2xl text-sm shadow-sm transition-all duration-300 ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {msg.role === 'model' ? (
                  msg.text ? (
                    <div className="leading-relaxed academic-text" dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  ) : (
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex gap-1 h-4 items-center text-indigo-500">
                        <span className="typing-dot"></span>
                        <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                        <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Consulting Syllabus...</span>
                    </div>
                  )
                ) : (
                  <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about pharmacy..."
              className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping} 
              className="w-14 h-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-40 transition-all flex items-center justify-center active:scale-90 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <ICONS.ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
