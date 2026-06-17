import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Briefcase, BarChart2, ShieldAlert, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const items = [
    {
      id: "candidate-ranking",
      title: "View Candidate Rankings",
      subtitle: "See all active candidate scores and semantic ranking status",
      icon: User,
      action: () => {
        navigate("/candidates");
        setIsOpen(false);
      },
    },
    {
      id: "hidden-talent",
      title: "Discover Hidden Talent",
      subtitle: "Uncover high-potential non-traditional profiles",
      icon: ShieldAlert,
      action: () => {
        navigate("/candidates");
        setIsOpen(false);
      },
    },
    {
      id: "interview-copilot",
      title: "AI Interview Copilot",
      subtitle: "Generate specialized technical or behavioral questions",
      icon: Sparkles,
      action: () => {
        navigate("/copilot");
        setIsOpen(false);
      },
    },
    {
      id: "analytics",
      title: "Hiring Analytics",
      subtitle: "Analyze skill gaps, hiring funnel and pipeline data",
      icon: BarChart2,
      action: () => {
        navigate("/analytics");
        setIsOpen(false);
      },
    },
    {
      id: "active-jobs",
      title: "Manage Active Jobs",
      subtitle: "Inspect, update, or edit existing job descriptions",
      icon: Briefcase,
      action: () => {
        navigate("/jobs");
        setIsOpen(false);
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Floating command prompt indicator in nav bar */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs text-zinc-400 group"
      >
        <Search className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
        <span>Search actions...</span>
        <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border border-white/20 bg-black/40 px-1.5 font-mono text-[9px] font-medium text-white/50">
          <span>Ctrl</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 pt-[20vh] md:pt-[22vh] items-start">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[800px] bg-zinc-950/80 border border-white/10 rounded-[24px] overflow-hidden shadow-[0_0_80px_-10px_rgba(79,70,229,0.3),_0_0_50px_-10px_rgba(6,182,212,0.2)] relative z-10 backdrop-blur-2xl"
            >
              {/* Search input container with breathing effect */}
              <motion.div 
                className="flex items-center gap-3 px-5 border-b"
                animate={{
                  borderColor: [
                    "rgba(255, 255, 255, 0.05)",
                    "rgba(139, 92, 246, 0.25)",
                    "rgba(6, 182, 212, 0.25)",
                    "rgba(255, 255, 255, 0.05)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or candidate..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 bg-transparent outline-none border-none text-white placeholder-zinc-500 text-sm focus:ring-0"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Action list */}
              <div className="max-h-[380px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-sm">
                    No results found for &ldquo;{search}&rdquo;
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Commands & Navigation
                    </div>
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full flex items-start gap-3 p-3 text-left rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-primary-accent group-hover:border-primary-accent/30 transition-colors shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-primary-accent transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {item.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-zinc-900/50 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex gap-2">
                  <span>Use keys</span>
                  <span className="px-1 py-0.2 bg-zinc-800 rounded border border-white/5 font-mono">↑↓</span>
                  <span>to navigate</span>
                </div>
                <div>Press ESC to close</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
