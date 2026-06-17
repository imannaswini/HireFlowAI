import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Brain, Sparkles, UserCheck, ShieldAlert, 
  FileText, Compass, Loader2
} from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import NeuralBackground from "@/components/NeuralBackground";
import AntiGravityCard from "@/components/AntiGravityCard";
import { useAppStore } from "@/store/useStore";
import { api } from "../api/client";

interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  score: number;
  potentialScore?: number;
  experience: string;
  badge: string;
  summary: string;
  resumeContent: {
    skills: string[];
    experienceBlocks: { title: string; company: string; duration: string; bullet: string }[];
    education: string;
  };
  metrics: { subject: string; value: number }[];
  questions: string[];
  shortlisted: boolean;
}

export default function CandidateIntelligence() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedSnippet, setSelectedSnippet] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);

  // Zustand State hooks
  const { toggleShortlist } = useAppStore();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/candidates/${id}`);
        setCandidate(res.data);
        setShortlisted(res.data.shortlisted);
      } catch (err) {
        console.error("Failed to fetch candidate:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleToggleShortlist = async () => {
    if (!candidate) return;
    try {
      const targetState = !shortlisted;
      const res = await api.post(`/candidates/${candidate.id}/shortlist`, {
        shortlisted: targetState
      });
      setShortlisted(res.data.shortlisted);
      toggleShortlist(candidate.id);
    } catch (err) {
      console.error("Failed to toggle shortlist status:", err);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden bg-aurora grid-overlay flex items-center justify-center">
        <NeuralBackground />
        <div className="flex flex-col items-center gap-3 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs text-zinc-400 font-light">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden bg-aurora grid-overlay flex items-center justify-center">
        <NeuralBackground />
        <div className="flex flex-col items-center gap-3 z-10 text-center">
          <ShieldAlert className="w-8 h-8 text-red-400" />
          <p className="text-sm font-semibold text-white">Candidate profile not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 border border-white/10 rounded-full text-xs text-zinc-400 hover:text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-aurora grid-overlay">
      <NeuralBackground />

      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">Back</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="text-xs text-zinc-400 font-mono">CANDIDATE INTELLIGENCE / {candidate.name.toUpperCase()}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-white/5 bg-white/5 rounded-full px-3 py-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-300 font-mono">Explainable Audit Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Layout: 3 Columns */}
      <div className="pt-20 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 z-10 relative max-w-[1600px] mx-auto w-full">
        
        {/* COLUMN 1: RESUME VIEWER */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <AntiGravityCard className="flex-1 p-5 bg-black/30 border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Resume Parser View
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">TXT VERSION</span>
              </div>

              <div className="space-y-4 text-xs font-light text-zinc-300 font-sans">
                <div 
                  onClick={() => setSelectedSnippet("Summary")}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    selectedSnippet === "Summary" ? "bg-primary-accent/10 border-primary-accent/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold text-white mb-1 font-sans">Executive Summary</div>
                  <p className="leading-relaxed font-light">{candidate.summary}</p>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="font-semibold text-white px-1">Professional Experience</div>
                  {candidate.resumeContent.experienceBlocks.map((block, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedSnippet(block.company)}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        selectedSnippet === block.company ? "bg-primary-accent/10 border-primary-accent/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-white text-[11px]">
                        <span>{block.title}</span>
                        <span>{block.duration}</span>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-medium">{block.company}</div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-normal font-light">{block.bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 font-sans">
                  <div className="font-semibold text-white mb-1">Education</div>
                  <p className="text-[11px] font-light text-zinc-400">{candidate.resumeContent.education}</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono pt-4 border-t border-white/5 mt-4">
              Click elements to map skills to corresponding AI metrics.
            </div>
          </AntiGravityCard>
        </div>

        {/* COLUMN 2: CANDIDATE INTELLIGENCE */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <AntiGravityCard className="p-6 bg-black/30 border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{candidate.name}</h2>
                    <span className="text-xs bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">
                      {candidate.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{candidate.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-500 font-mono uppercase">Match score</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {candidate.score}%
                  </div>
                </div>
              </div>

              <div className="w-full h-56 flex items-center justify-center my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={candidate.metrics}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={9} />
                    <Radar name="Evaluation" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Latent Skills Discovered</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.resumeContent.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-zinc-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Potential Score: {candidate.potentialScore || candidate.score}%</span>
              <span>Explainable Confidence: 99.1%</span>
            </div>
          </AntiGravityCard>
        </div>

        {/* COLUMN 3: AI RECOMMENDATIONS */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <AntiGravityCard className="p-5 bg-black/40 border-white/10" floatRange={4}>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              Recruiter Action Board
            </h3>

            <div className="space-y-2.5">
              <button 
                onClick={handleToggleShortlist}
                className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  shortlisted
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-primary-accent hover:bg-primary-accent/80 text-white"
                }`}
              >
                <UserCheck className="w-4 h-4" /> 
                {shortlisted ? "Candidate Shortlisted" : "Shortlist Candidate"}
              </button>

              <button className="w-full py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all">
                Initiate Screening Loop
              </button>
            </div>
          </AntiGravityCard>

          <AntiGravityCard className="flex-1 p-5 bg-black/40 border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-highlight" />
                Copilot Custom Questions
              </h3>

              <div className="space-y-3.5">
                {candidate.questions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/5 bg-zinc-950/40 relative">
                    <p className="text-[11px] text-zinc-200 leading-relaxed font-light italic">
                      &ldquo;{q}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono pt-4 border-t border-white/5 mt-4">
              Confidence levels calculated from profile comparison delta checks.
            </div>
          </AntiGravityCard>
        </div>

      </div>
    </div>
  );
}
