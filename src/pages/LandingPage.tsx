import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Play, Briefcase, Sparkles, Award, UserCheck, ShieldAlert, Cpu,
  ArrowUpRight, Database, Zap, Brain, MessageSquare, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeuralBackground from "@/components/NeuralBackground";
import AntiGravityCard from "@/components/AntiGravityCard";
import OrbitalRing from "@/components/OrbitalRing";
import CommandPalette from "@/components/CommandPalette";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [replayStage, setReplayStage] = useState<number>(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const pipelineStages = [
    {
      title: "Job Description",
      desc: "Paste requirements or import directly.",
      icon: Briefcase,
      color: "from-blue-500 to-indigo-500",
      content: {
        title: "Senior Product Engineer",
        details: ["8+ Years React/TypeScript", "Next.js App Router Architecture", "Framer Motion Animation Experience"]
      }
    },
    {
      title: "AI Semantic Analysis",
      desc: "Maps requirements to latent skills.",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      content: {
        title: "Concept Map Built",
        details: ["Mapped 'Framer Motion' to SVG, WebGL, CSS Physics", "Identified high-agency attributes", "Parsed tech stack correlations"]
      }
    },
    {
      title: "Candidate Ranking",
      desc: "Profiles ranked by fit and potential.",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      content: {
        title: "Semantic Rank List",
        details: ["Sarah Jenkins: 98% Match (Rank 1)", "Marcus Vance: 91% Match (Rank 2)", "Elena Rostova: 84% -> 95% Potential (Rank 3)"]
      }
    },
    {
      title: "Interview Copilot",
      desc: "Generate contextual deep-dives.",
      icon: MessageSquare,
      color: "from-pink-500 to-cyan-500",
      content: {
        title: "Interview Pack Generated",
        details: ["3 Technical Architecture Questions", "2 Collaborative Behavioral Prompts", "1 Project deep dive (Vercel Integration)"]
      }
    },
    {
      title: "Hiring Decision",
      desc: "Data-driven, bias-free recommendations.",
      icon: UserCheck,
      color: "from-cyan-500 to-green-500",
      content: {
        title: "Final Decision Board",
        details: ["AI Recommendation: Fast-track to Panel", "Score confidence level: 94%", "Transparent verification logs ready"]
      }
    }
  ];

  const replayScores = [
    { name: "React Match", score: "+35", cumulative: 35, desc: "8+ years production scale architecture" },
    { name: "Experience", score: "+25", cumulative: 60, desc: "Lead developer at Vercel & Linear" },
    { name: "Projects", score: "+15", cumulative: 75, desc: "Created open-source animation engine" },
    { name: "Leadership", score: "+10", cumulative: 85, desc: "Managed frontend core team of 6" },
    { name: "Learning Potential", score: "+10", cumulative: 95, desc: "Pivoted from Rust kernel dev to Next.js" }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-aurora grid-overlay">
      <NeuralBackground />

      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-accent via-highlight to-secondary-accent flex items-center justify-center p-[1px] relative">
              <div className="w-full h-full rounded-[11px] bg-black flex items-center justify-center">
                <Brain className="w-4.5 h-4.5 text-secondary-accent" />
              </div>
            </div>
            <span className="font-semibold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              HIREFLOW AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#talent" className="hover:text-white transition-colors">Hidden Talent</a>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-4">
            <CommandPalette />
            <Link
              to="/dashboard"
              className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Recruiter Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 text-xs text-zinc-400"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explainable AI Recruiter Copilot</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-[1.1]"
        >
          Hire Smarter.<br />Faster. Fairer.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl font-light"
        >
          The Explainable AI Recruiter Copilot for Modern Hiring Teams. Reveal latent skills, rank candidates transparently, and streamline decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-accent to-highlight text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 group shadow-[0_0_30px_rgba(79,70,229,0.3)]"
          >
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => setShowDemoVideo(true)}
            className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400" /> Watch Demo
          </button>
        </motion.div>

        {/* HERO VISUALIZATION */}
        <div className="w-full mt-24 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <AntiGravityCard
                  key={idx}
                  floatRange={6}
                  floatDuration={5 + idx}
                  className="p-5 text-left border-white/5 relative group min-h-[160px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">0{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-primary-accent transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                    {stage.desc}
                  </p>
                </AntiGravityCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 border-y border-white/5 bg-black/20 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-6">
            TRUSTED BY THE WORLD&apos;S MOST INNOVATIVE TEAMS
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-zinc-400 font-semibold tracking-wider text-sm">
            <span className="hover:text-white transition-colors">STRIPE</span>
            <span className="hover:text-white transition-colors">VERCEL</span>
            <span className="hover:text-white transition-colors">LINEAR</span>
            <span className="hover:text-white transition-colors">PERPLEXITY</span>
            <span className="hover:text-white transition-colors">APPLE</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT SHOWCASE */}
      <section id="showcase" className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 text-xs text-zinc-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Workflow</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">Product Showcase</h2>
          <p className="text-zinc-400 text-sm mt-3 max-w-lg font-light">
            Click through our recruiting loop stages to see how HireFlow AI transforms typical hiring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 space-y-3">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${activeStage === idx
                      ? "border-primary-accent/40 bg-primary-accent/5"
                      : "border-white/5 bg-transparent hover:bg-white/5"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-zinc-900 border ${activeStage === idx ? "border-primary-accent text-primary-accent" : "border-white/5 text-zinc-400"
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{stage.title}</div>
                      <div className="text-[10px] text-zinc-500">{stage.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-zinc-600 transition-transform ${activeStage === idx ? "text-primary-accent translate-x-1" : "group-hover:translate-x-1"
                    }`} />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <AntiGravityCard className="w-full h-full p-6 bg-black/40 border-white/5 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      Live AI Output preview
                    </span>
                  </div>
                  <span className="text-xs text-primary-accent font-semibold bg-primary-accent/10 px-2 py-0.5 rounded-full">
                    Stage {activeStage + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {pipelineStages[activeStage].content.title}
                </h3>

                <ul className="space-y-2.5 mt-4">
                  {pipelineStages[activeStage].content.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-highlight mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Confidence Index: 98.6%</span>
                <span>Latency: 12ms</span>
              </div>
            </AntiGravityCard>
          </div>
        </div>
      </section>

      {/* EXPLAINABLE MATCH REPLAY */}
      <section className="py-24 px-6 border-t border-white/5 bg-zinc-950/20 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400">
              <Brain className="w-3.5 h-3.5 text-highlight" />
              <span>Flagship Innovation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Explainable Match Replay™
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Don&apos;t guess why candidates are suggested. Our Match Replay reveals the exact contribution of each factor (skills, experience, leadership) as it compiles a unified hiring score in real-time.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setReplayStage((prev) => (prev + 1) % (replayScores.length + 1))}
                className="px-5 py-2.5 rounded-full bg-highlight text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                {replayStage === replayScores.length ? "Reset Replay" : "Next Score Builder"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AntiGravityCard className="p-6 bg-black/40 border-white/10 relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-zinc-500">EXPLANATION SEQUENCE</span>
                <span className="text-2xl font-bold text-highlight font-mono">
                  {replayStage === 0 ? "0%" : `${replayScores[Math.min(replayStage - 1, replayScores.length - 1)].cumulative}%`}
                </span>
              </div>

              <div className="space-y-3">
                {replayScores.map((scoreItem, idx) => {
                  const isActive = replayStage > idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${isActive
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-transparent border-white/5 text-zinc-600"
                        }`}
                    >
                      <div className="flex justify-between text-xs font-medium">
                        <span className={isActive ? "text-white" : "text-zinc-600"}>{scoreItem.name}</span>
                        <span className={isActive ? "text-cyan-400" : "text-zinc-600"}>{scoreItem.score}</span>
                      </div>
                      {isActive && (
                        <p className="text-[10px] text-zinc-400 mt-1 font-light">{scoreItem.desc}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </AntiGravityCard>
          </div>
        </div>
      </section>

      {/* HIDDEN TALENT DISCOVERY */}
      <section id="talent" className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
              <OrbitalRing size={380} duration={20} color="from-purple-500 via-pink-500 to-primary-accent" />
              <OrbitalRing size={260} duration={15} reverse color="from-cyan-400 via-blue-500 to-indigo-500" />

              <AntiGravityCard className="p-6 w-72 bg-zinc-950/80 border-white/15 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold tracking-wider uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Hidden Talent</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">ID: #14</span>
                </div>

                <h4 className="text-sm font-bold text-white mb-0.5">Elena Rostova</h4>
                <p className="text-[10px] text-zinc-500">Non-Traditional Applicant</p>

                <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-white/5">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Current Rank</div>
                    <div className="text-base font-bold text-zinc-400">#14</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Potential Rank</div>
                    <div className="text-base font-bold text-green-400">#3</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[9px] text-zinc-400 font-mono flex items-center justify-between">
                    <span>Transferable Skills Match</span>
                    <span className="text-green-400">92%</span>
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono flex items-center justify-between">
                    <span>Learning Potential</span>
                    <span className="text-cyan-400">97%</span>
                  </div>
                </div>
              </AntiGravityCard>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Uncover Latent Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Hidden Talent Discovery™
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Standard resume parsers miss top performers due to keyword rigidity. Our system tracks transferable technical skill maps, high-impact open-source contributions, and learning indicators to identify candidates who deserve a shot.
            </p>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
              <div className="text-xs font-semibold text-white">Why Elena?</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                Elena doesn&apos;t list &ldquo;Next.js&rdquo; explicitly but has built core TypeScript application servers and has an active Github repository showcasing excellent asynchronous systems integration, pointing to a rapid adaptation potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI INTERVIEW COPILOT */}
      <section className="py-24 px-6 border-t border-white/5 bg-zinc-950/20 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generative Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">AI Interview Copilot</h2>
            <p className="text-zinc-400 text-sm font-light">
              Receive smart, contextual questions generated for each candidate, based on their individual background gaps and project specifications. Includes confidence rating guides for recruiters.
            </p>
            <Link
              to="/dashboard?tab=copilot"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
            >
              Generate custom packs in dashboard <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <AntiGravityCard className="p-5 text-left border-white/10 bg-black/40">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Technical pack</div>
              <h4 className="text-xs font-bold text-white mb-2">&ldquo;How do you optimize state rendering when integrating dynamic WebGL scenes inside React?&rdquo;</h4>
              <p className="text-[10px] text-zinc-400 leading-normal mb-3">Targeting: Framer Motion and canvas integrations on Vercel dashboards.</p>
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                <span>Difficulty: Advanced</span>
                <span className="text-green-400">Confidence: High</span>
              </div>
            </AntiGravityCard>

            <AntiGravityCard className="p-5 text-left border-white/10 bg-black/40" floatRange={7} floatDuration={7}>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2">Behavioral Pack</div>
              <h4 className="text-xs font-bold text-white mb-2">&ldquo;Explain a project tradeoff where you chose suboptimal code velocity for technical clarity.&rdquo;</h4>
              <p className="text-[10px] text-zinc-400 leading-normal mb-3">Targeting: Agency alignment and leadership capabilities.</p>
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                <span>Difficulty: Medium</span>
                <span className="text-purple-400">Confidence: Medium</span>
              </div>
            </AntiGravityCard>
          </div>
        </div>
      </section>

      {/* HIRING ANALYTICS SHOWCASE */}
      <section className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 text-xs text-zinc-400">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Analytics</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">Hiring Analytics Hub</h2>
          <p className="text-zinc-400 text-sm mt-3 max-w-lg font-light">
            Stay on top of recruiting funnels, verify skill coverage, and ensure pipeline compliance through our dashboard analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AntiGravityCard className="p-6 bg-black/40 border-white/5">
            <h4 className="text-sm font-semibold mb-2">Skill Gap Index</h4>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>TypeScript Core</span>
                  <span>95%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Rust / WebAssembly</span>
                  <span>42%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>
            </div>
          </AntiGravityCard>

          <AntiGravityCard className="p-6 bg-black/40 border-white/5" floatRange={5} floatDuration={5}>
            <h4 className="text-sm font-semibold mb-2">Hiring Funnel Status</h4>
            <div className="flex justify-between items-center text-xs mt-6 border-b border-white/5 pb-2">
              <span className="text-zinc-400">Shortlisted</span>
              <span className="text-white font-mono font-bold">142</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
              <span className="text-zinc-400">AI Screened</span>
              <span className="text-white font-mono font-bold">96</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-zinc-400">Offered</span>
              <span className="text-white font-mono font-bold">3</span>
            </div>
          </AntiGravityCard>

          <AntiGravityCard className="p-6 bg-black/40 border-white/5">
            <h4 className="text-sm font-semibold mb-2">Match Trends</h4>
            <p className="text-[11px] text-zinc-400 mt-2">
              Recruitment standards have increased average applicant match scores by +14% due to clear prompt optimization loops.
            </p>
            <div className="mt-8 text-xs text-primary-accent font-semibold flex items-center gap-1">
              <span>View full metrics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </AntiGravityCard>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 border-t border-white/5 bg-zinc-950/20 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-6">
            WHAT RECRUITING VETERANS SAY
          </p>
          <div className="max-w-3xl">
            <h3 className="text-xl md:text-3xl font-light italic leading-normal text-zinc-300">
              &ldquo;HireFlow AI&apos;s Explainable Match Replay saved us hours of debate. We knew exactly why candidates were ranked the way they were. Found a Lead Engineer who had been overlooked for months.&rdquo;
            </h3>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold font-mono">
                AM
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">Angela Mercer</div>
                <div className="text-[10px] text-zinc-500 font-mono">VP of Talent, Linear</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto z-10 relative">
        <div className="rounded-3xl border border-white/10 bg-black/50 p-12 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-radial from-primary-accent/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to upgrade your hiring stack?
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg text-sm font-light">
            Deploy our Explainable AI recruiter platform and discover hidden talent in your candidate database.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <div>
            <span>&copy; {new Date().getFullYear()} HireFlow AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 font-mono">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Status: Operational</a>
          </div>
        </div>
      </footer>

      {/* DEMO VIDEO MODAL MOCK */}
      <AnimatePresence>
        {showDemoVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoVideo(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl aspect-video bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden relative z-10 flex flex-col justify-center items-center p-8 text-center"
            >
              <button
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                Close Demo
              </button>
              <Cpu className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Simulated Interactive Demo Session</h3>
              <p className="text-zinc-400 text-sm max-w-md">
                Experience the live candidate matchmaking flow, natural language recruiter prompts, and transparency audits in the dashboard workspace.
              </p>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="mt-6 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold"
              >
                Enter Platform
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
