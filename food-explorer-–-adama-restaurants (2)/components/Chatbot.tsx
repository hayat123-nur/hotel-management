import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { askChatbot } from "../services/api";
import { ChatMessage } from "../types";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "Welcome to Adama! I am your Smart Hotel Assistant. How can I help you find the perfect stay or service today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  const handleSend = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("foodToken");
      if (!token) {
        const errorMsg: ChatMessage = {
          role: "model",
          content: "Please log in to consult the culinary archives!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const response = await askChatbot(messageText, token);
      
      // Extract answer text from various response formats
      let answerText = "";
      
      if (typeof response === "string") {
        answerText = response;
      } else if (response?.answer) {
        answerText = response.answer;
      } else if (response?.data?.answer) {
        answerText = response.data.answer;
      } else if (response?.text) {
        answerText = response.text;
      } else if (response?.data?.text) {
        answerText = response.data.text;
      } else {
        // Fallback to stringifying the response
        answerText = JSON.stringify(response);
      }
      
      const botMsg: ChatMessage = {
        role: "model",
        content: answerText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat API Error:", error);
      const errorMsg: ChatMessage = {
        role: "model",
        content:
          error?.message || "I encountered an error. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gourmet-charcoal hover:bg-gourmet-clay text-gourmet-amber p-5 rounded-full shadow-3xl transition-all transform hover:scale-110 active:scale-95 group flex items-center gap-3 border border-gourmet-amber/20 amber-glow"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-black uppercase tracking-widest text-xs">
            Consult the AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className={`${
          isFullscreen ? "fixed inset-6 z-[9999] w-auto h-auto" : "w-[350px] sm:w-[400px] h-[500px]"
        } bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300`}> 
          {/* Header */}
          <div className="gradient-bg p-6 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gourmet-amber/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-gourmet-amber/20 p-2.5 rounded-full border border-gourmet-amber/30">
                <Bot className="text-gourmet-amber w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black serif text-base tracking-tight text-white">Hotel Assistant</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                  <span className="text-[9px] opacity-60 uppercase tracking-[0.2em] font-black">
                    At Your Service
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 hover:bg-white/10 p-2 rounded-xl transition-all text-gourmet-cream/60 hover:text-white"
              aria-label="Close chat"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute left-6 bottom-3 flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="relative z-10 hover:bg-white/5 p-2 rounded-xl transition-all text-white/80 text-sm"
                aria-label="Minimize chat"
                type="button"
              >
                —
              </button>
              <button
                onClick={() => setIsFullscreen((s) => !s)}
                className="relative z-10 hover:bg-white/5 p-2 rounded-xl transition-all text-white/80 text-sm"
                aria-label="Toggle fullscreen"
                type="button"
              >
                ⤢
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" style={{ maxHeight: isFullscreen ? 'calc(100vh - 220px)' : undefined }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
                      msg.role === "user" ? "bg-gourmet-cream border-gourmet-amber/20" : "bg-gourmet-charcoal border-white/10"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-gourmet-charcoal" />
                    ) : (
                      <Bot className="w-4 h-4 text-gourmet-amber" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gourmet-amber text-gourmet-charcoal font-bold rounded-tr-none shadow-lg amber-glow"
                        : "bg-white border border-gourmet-amber/10 text-gourmet-charcoal shadow-sm rounded-tl-none"
                    }`}
                  >
                    {msg.role === "model" ? (
                      <div className="space-y-2">
                        {msg.content.split('\n').map((line, idx) => {
                          // Handle bullet points
                          if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                            return (
                              <div key={idx} className="flex gap-2 items-start">
                                <span className="text-gourmet-amber mt-0.5">•</span>
                                <span className="flex-1">{line.replace(/^[•\-*]\s*/, '')}</span>
                              </div>
                            );
                          }
                          // Handle numbered lists
                          if (/^\d+\./.test(line.trim())) {
                            const match = line.match(/^(\d+)\.\s*(.+)$/);
                            if (match) {
                              return (
                                <div key={idx} className="flex gap-2 items-start">
                                  <span className="text-gourmet-amber font-bold">{match[1]}.</span>
                                  <span className="flex-1">{match[2]}</span>
                                </div>
                              );
                            }
                          }
                          // Handle emoji markers (📍, 💡, etc.)
                          if (line.trim().match(/^[📍💡✅❌⚠️🔍]/)) {
                            return (
                              <div key={idx} className="font-medium">
                                {line}
                              </div>
                            );
                          }
                          // Handle bold text (**text**)
                          const boldFormatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
                          // Regular lines
                          if (line.trim()) {
                            return (
                              <div key={idx} dangerouslySetInnerHTML={{ __html: boldFormatted }} />
                            );
                          }
                          // Empty lines for spacing
                          return <div key={idx} className="h-1" />;
                        })}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-500 italic">
                      Assistant is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => handleSend(e)}
            className="p-6 bg-white border-t border-gourmet-amber/10 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotels or services..."
              className="flex-1 bg-gourmet-cream border border-gourmet-amber/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gourmet-amber transition-all serif italic"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gourmet-charcoal text-gourmet-amber p-3 rounded-2xl hover:bg-gourmet-clay disabled:opacity-30 transition-all shadow-lg amber-glow"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {/* Quick query suggestions - Compact */}
          <div className="px-3 py-2 border-t border-gourmet-amber/5 bg-gourmet-cream/30 flex gap-1.5 flex-wrap">
            {[
              "Best hotels in Adama",
              "Luxury stays with lake view",
              "Hotels with conference rooms",
              "Budget-friendly guest houses",
              "Top-rated hotel services",
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleSend(undefined, s)}
                className="text-[8px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border border-gourmet-amber/10 bg-white text-gourmet-charcoal/60 hover:border-gourmet-amber hover:text-gourmet-amber transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimized Chat Bar (compact, still shows last message and a button to show all) */}
      {isOpen && isMinimized && (
        <div className="w-56 bg-white rounded-2xl shadow-lg flex flex-col border border-gray-100 overflow-hidden">
          <div className="p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-gourmet-amber/20 p-2 rounded-full border border-gourmet-amber/30">
                <Bot className="text-gourmet-amber w-5 h-5" />
              </div>
              <div className="text-sm leading-tight truncate max-w-[160px]">
                {messages.length ? messages[messages.length - 1].content : 'No messages yet'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsMinimized(false); setIsFullscreen(false); }}
                className="text-[11px] px-3 py-1 rounded-full bg-gourmet-charcoal text-gourmet-amber"
              >
                Show all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
