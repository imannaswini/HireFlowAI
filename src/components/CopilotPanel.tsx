"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Brain, Cpu, MessageSquare, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function CopilotPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "copilot",
      text: "Hello! I am your AI Recruiter Copilot. Ask me to parse a job, suggest interview questions, rank profiles, or discover hidden talent.",
      timestamp: new Date(),
      suggestions: [
        "Find React developers with leadership experience.",
        "Highlight candidates missing only one required skill.",
        "Generate behavioral interview questions for Lead PM.",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let replyText = "";
      let suggestions: string[] = [];

      if (text.toLowerCase().includes("react") || text.toLowerCase().includes("developer")) {
        replyText = "Analyzing candidates for **React** + **Leadership**:\n\n1. **Sarah Jenkins** (98% Match): Lead Developer. Managed a team of 6 at Vercel. 8 years React experience.\n2. **Marcus Vance** (91% Match): Senior Frontend. Spearheaded Next.js migration at Linear.\n\n*Would you like me to generate custom interview questions for Sarah?*";
        suggestions = ["Generate questions for Sarah", "Compare Marcus and Sarah"];
      } else if (text.toLowerCase().includes("missing") || text.toLowerCase().includes("skill")) {
        replyText = "Scanning pipeline for near-miss high-potential candidates:\n\n**Candidate #14 (Elena Rostova)**:\n- Core Match: 84% -> Potential: 95%\n- Missing: *AWS Cloud Practitioner Certification*\n- Strong offset: Built and deployed serverless microservices at Scale AI.\n\n*Highly recommend shortlisting Elena under 'Hidden Talent'.*";
        suggestions = ["View Elena's full profile", "Why is Elena's potential rank 3?"];
      } else if (text.toLowerCase().includes("question") || text.toLowerCase().includes("interview")) {
        replyText = "Here are 3 tailored interview questions for Lead Product Manager:\n\n1. **Technical**: 'How do you prioritize platform debt versus customer feature requests?' (Focus: Strategic tradeoff analysis)\n2. **Behavioral**: 'Tell me about a time you killed a product feature that you had previously advocated for.'\n3. **Follow-up**: 'What indicators do you track to measure feature adoption?'";
      } else {
        replyText = "Understood. Re-indexing job criteria and candidates. I've updated the neural semantic map. Please let me know how I can assist next.";
      }

      const copilotMsg: Message = {
        id: Math.random().toString(),
        sender: "copilot",
        text: replyText,
        timestamp: new Date(),
        suggestions,
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 border-l border-white/5 backdrop-blur-xl relative">
      {/* Copilot Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-accent to-highlight flex items-center justify-center relative overflow-hidden">
            <Cpu className="w-4 h-4 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              HireFlow Copilot
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono">Semantic OS v1.0.4</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="p-1 rounded bg-zinc-900 border border-white/5 text-zinc-500">
            <Terminal className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary-accent text-white"
                    : "glass-panel border-white/5 text-zinc-200"
                }`}
                style={{
                  boxShadow: msg.sender === "user" ? "0 4px 15px rgba(79, 70, 229, 0.2)" : "none",
                }}
              >
                {/* Simulated Markdown renderer */}
                <div className="space-y-2">
                  {msg.text.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    }} />
                  ))}
                </div>
              </div>

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 justify-start">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 text-zinc-300 transition-all text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-2xl px-3 py-2 text-zinc-400 w-16"
            >
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="p-3 border-t border-white/5 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-xl"
        >
          <input
            type="text"
            placeholder="Ask Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 px-2.5 py-1.5 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-primary-accent hover:bg-primary-accent/80 text-white transition-colors disabled:opacity-40 disabled:hover:bg-primary-accent"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
