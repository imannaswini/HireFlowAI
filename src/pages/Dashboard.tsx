import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Briefcase, Users, RefreshCw, Sparkles, 
  BarChart3, Settings, ShieldAlert, Cpu, 
  ArrowUpRight, ChevronRight, Plus, Brain, UploadCloud, X, Check, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import NeuralBackground from "@/components/NeuralBackground";
import AntiGravityCard from "@/components/AntiGravityCard";
import { useAppStore } from "@/store/useStore";
import CopilotPanel from "@/components/CopilotPanel";
import CommandPalette from "@/components/CommandPalette";
import { api } from "../api/client";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand State hooks
  const {
    activeTab,
    setActiveTab,
    selectedJobId,
    setSelectedJobId,
    replaySequenceStage,
    setReplaySequenceStage,
    jobs,
    addJob,
    setJobs,
  } = useAppStore();

  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // New Backend Data States
  const [kpiData, setKpiData] = useState<any>(null);
  const [jobAnalyticsData, setJobAnalyticsData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Add Job Criteria Modal State
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redesigned ATS Form Fields
  const [formCompany, setFormCompany] = useState("");
  const [formDept, setFormDept] = useState("Engineering");
  const [formLocation, setFormLocation] = useState("");
  const [formEmpType, setFormEmpType] = useState("Full-time");
  const [formTitle, setFormTitle] = useState("");
  const [formRoleCat, setFormRoleCat] = useState("");
  const [formExperience, setFormExperience] = useState("");
  const [formSalary, setFormSalary] = useState("");
  const [formReqSkills, setFormReqSkills] = useState<string[]>([]);
  const [formPrefSkills, setFormPrefSkills] = useState<string[]>([]);
  const [extractedResponsibilities, setExtractedResponsibilities] = useState<string[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Tag inputs temp text
  const [reqSkillInput, setReqSkillInput] = useState("");
  const [prefSkillInput, setPrefSkillInput] = useState("");

  // Simulated Candidates Match notification state
  const [isMatching, setIsMatching] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ["pdf", "docx", "txt"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension && validExtensions.includes(fileExtension)) {
      setUploadedFile(file);
      setError(null);
    } else {
      setError("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      setUploadedFile(null);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedFile && !pasteText.trim()) {
      setError("Please upload a job description file or paste details.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // Simulate AI extraction using mock data
    setTimeout(() => {
      const textToScan = (pasteText + " " + (uploadedFile?.name || "")).toLowerCase();
      
      let title = "Distributed Systems Engineer";
      let role = "Cloud Infrastructure Engineer";
      let dept = "Infrastructure";
      let company = "Scale AI";
      let loc = "San Francisco, CA";
      let type = "Full-time";
      let reqSkills = ["Go", "Kubernetes", "gRPC", "Docker", "PostgreSQL"];
      let prefSkills = ["Rust", "Distributed Databases"];
      let exp = "5+ years";
      let sal = "$170,000 - $220,000";
      let responsibilities = [
        "Design and scale high-throughput streaming pipelines for AI training sets.",
        "Build fault-tolerant microservices running on global clusters.",
        "Improve network throughput and minimize replication latency."
      ];

      if (textToScan.includes("product") || textToScan.includes("pm") || textToScan.includes("manager")) {
        title = "Lead Product Manager";
        role = "Core Growth PM";
        dept = "Product";
        company = "Stripe";
        loc = "San Francisco, CA (Hybrid)";
        type = "Full-time";
        reqSkills = ["Product Strategy", "Roadmapping", "A/B Testing", "SQL"];
        prefSkills = ["MBA", "Fintech Experience"];
        exp = "6+ years";
        sal = "$160,000 - $210,000";
        responsibilities = [
          "Define the multi-year product strategy for core payment flows.",
          "Collaborate with engineering, design, and risk teams to execute launches.",
          "Synthesize customer insights into clear product requirements documents (PRDs)."
        ];
      } else if (textToScan.includes("react") || textToScan.includes("frontend") || textToScan.includes("developer")) {
        title = "Senior Product Engineer";
        role = "Frontend UI Specialist";
        dept = "Engineering";
        company = "Linear";
        loc = "Remote (US/EU)";
        type = "Full-time";
        reqSkills = ["React", "TypeScript", "Next.js", "Framer Motion", "Tailwind CSS"];
        prefSkills = ["Open Source Contributions", "WebGL / Canvas"];
        exp = "8+ years";
        sal = "$150,000 - $190,000";
        responsibilities = [
          "Architect highly-responsive user interfaces and animations.",
          "Drive the design system implementation across multiple workspaces.",
          "Optimize web performance to maintain a sub-100ms interaction latency."
        ];
      }

      setFormTitle(title);
      setFormRoleCat(role);
      setFormDept(dept);
      setFormCompany(company);
      setFormLocation(loc);
      setFormEmpType(type);
      setFormReqSkills(reqSkills);
      setFormPrefSkills(prefSkills);
      setFormExperience(exp);
      setFormSalary(sal);
      setExtractedResponsibilities(responsibilities);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const addRequiredSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && reqSkillInput.trim()) {
      e.preventDefault();
      if (!formReqSkills.includes(reqSkillInput.trim())) {
        setFormReqSkills([...formReqSkills, reqSkillInput.trim()]);
      }
      setReqSkillInput("");
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setFormReqSkills(formReqSkills.filter(s => s !== skill));
  };

  const addPreferredSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prefSkillInput.trim()) {
      e.preventDefault();
      if (!formPrefSkills.includes(prefSkillInput.trim())) {
        setFormPrefSkills([...formPrefSkills, prefSkillInput.trim()]);
      }
      setPrefSkillInput("");
    }
  };

  const removePreferredSkill = (skill: string) => {
    setFormPrefSkills(formPrefSkills.filter(s => s !== skill));
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully to central ATS repository!");
    setIsAddJobModalOpen(false);
    resetForm();
  };

  const fetchCandidates = async (jobId: string) => {
    if (!jobId) return;
    setCandidatesLoading(true);
    try {
      const res = await api.get(`/jobs/${jobId}/candidates`);
      setCandidatesList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedJobId) {
      const file = e.target.files[0];
      setResumeUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("job_id", selectedJobId);
        formData.append("file", file);

        await api.post("/resumes/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        // Refresh candidates list
        await fetchCandidates(selectedJobId);
        
        // Also refresh jobs list to get updated scan counts
        const jobsRes = await api.get("/jobs");
        setJobs(jobsRes.data);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.detail || "Failed to upload resume.");
      } finally {
        setResumeUploading(false);
        e.target.value = "";
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        const [jobsRes, kpiRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/analytics/kpis")
        ]);
        
        if (jobsRes.data && jobsRes.data.length > 0) {
          setJobs(jobsRes.data);
          const jobIds = jobsRes.data.map((j: any) => j.id);
          if (!selectedJobId || !jobIds.includes(selectedJobId)) {
            setSelectedJobId(jobsRes.data[0].id);
          }
        }
        
        if (kpiRes.data) {
          setKpiData(kpiRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard core data:", err);
        setDashboardError("Failed to load dashboard data. Please check your connection.");
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, [setJobs, setSelectedJobId]);

  useEffect(() => {
    const fetchJobSpecificData = async () => {
      if (!selectedJobId) return;
      try {
        const [candidatesRes, analyticsRes] = await Promise.all([
          api.get(`/jobs/${selectedJobId}/candidates`),
          api.get(`/analytics/jobs/${selectedJobId}/analytics`)
        ]);
        setCandidatesList(candidatesRes.data || []);
        setJobAnalyticsData(analyticsRes.data || null);
      } catch (err) {
        console.error("Failed to fetch job specific data:", err);
      }
    };
    fetchJobSpecificData();
  }, [selectedJobId]);

  const handleCreateJob = async () => {
    if (!formTitle || !formCompany) {
      setError("Job Title and Company Name are required fields.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("company_name", formCompany);
      formData.append("job_title", formTitle);
      formData.append("department", formDept);
      formData.append("experience_required", formExperience);
      formData.append("required_skills", formReqSkills.join(","));
      if (pasteText) {
        formData.append("jd_description", pasteText);
      }
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }

      setIsMatching(true);
      const res = await api.post("/jobs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const jobsRes = await api.get("/jobs");
      setJobs(jobsRes.data);
      if (res.data && res.data.job) {
        setSelectedJobId(res.data.job.id);
      }
      
      setIsAddJobModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to create job criteria.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleAnalyzeAndMatch = async () => {
    if (!formTitle || !formCompany) {
      setError("Job Title and Company Name are required fields to begin matching.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("company_name", formCompany);
      formData.append("job_title", formTitle);
      formData.append("department", formDept);
      formData.append("experience_required", formExperience);
      formData.append("required_skills", formReqSkills.join(","));
      if (pasteText) {
        formData.append("jd_description", pasteText);
      }
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }

      setIsMatching(true);
      const res = await api.post("/jobs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const jobsRes = await api.get("/jobs");
      setJobs(jobsRes.data);
      if (res.data && res.data.job) {
        setSelectedJobId(res.data.job.id);
      }
      
      setIsAddJobModalOpen(false);
      resetForm();
      handleTabChange("candidates");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze and match.");
    } finally {
      setIsMatching(false);
    }
  };

  const resetForm = () => {
    setUploadedFile(null);
    setPasteText("");
    setFormCompany("");
    setFormDept("Engineering");
    setFormLocation("");
    setFormEmpType("Full-time");
    setFormTitle("");
    setFormRoleCat("");
    setFormExperience("");
    setFormSalary("");
    setFormReqSkills([]);
    setFormPrefSkills([]);
    setExtractedResponsibilities([]);
    setHasAnalyzed(false);
    setError(null);
  };

  useEffect(() => {
    const path = location.pathname.substring(1); // e.g. "jobs", "candidates", "replay", "copilot", "analytics", "settings"
    const validTabs = ["jobs", "candidates", "replay", "copilot", "analytics", "settings"];
    if (path && validTabs.includes(path)) {
      setActiveTab(path);
    } else {
      const tab = searchParams.get("tab");
      if (tab) {
        setActiveTab(tab);
      } else {
        setActiveTab("dashboard");
      }
    }
  }, [location, searchParams, setActiveTab]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/${tabName}`);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "replay", label: "Match Replay", icon: RefreshCw },
    { id: "copilot", label: "AI Insights", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Compute Spotlight Candidate
  const spotlightCandidate = candidatesList && candidatesList.length > 0
    ? candidatesList.reduce((prev, current) => {
        const prevGap = (prev.potentialScore || 0) - (prev.score || 0);
        const currGap = (current.potentialScore || 0) - (current.score || 0);
        return currGap > prevGap ? current : prev;
      }, candidatesList[0])
    : null;
  const showSpotlight = spotlightCandidate && ((spotlightCandidate.potentialScore || 0) - (spotlightCandidate.score || 0) > 0);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-aurora grid-overlay">
      <NeuralBackground />

      {/* Header Panel */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary-accent via-highlight to-secondary-accent flex items-center justify-center p-[1px]">
                <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-semibold text-sm tracking-wider">HIREFLOW AI</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="text-xs text-zinc-400 font-mono">WORKSPACE / CENTRAL COMMAND</div>
          </div>

          <div className="flex items-center gap-4">
            <CommandPalette />
            <div className="flex items-center gap-2 border border-white/5 bg-white/5 rounded-full px-3 py-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-zinc-300 font-mono">Agent Sync Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Dashboard Layout */}
      <div className="pt-20 h-[calc(100vh)] flex z-10 relative max-w-[1600px] mx-auto w-full px-6 gap-6">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className="w-64 flex flex-col pb-6">
          <AntiGravityCard floatRange={3} floatDuration={7} className="flex-1 flex flex-col p-4 border-white/5 bg-black/30">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-2 mb-4">
              RECRUITER COPILOT OS
            </div>

            <nav className="flex-1 space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? "bg-primary-accent/10 border-primary-accent/30 text-white"
                        : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary-accent" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-accent via-highlight to-secondary-accent flex items-center justify-center text-[10px] font-bold font-mono text-white relative shrink-0">
                  HF
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                    HireFlow AI
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-500 font-medium truncate">Explainable Recruiter Copilot</div>
                </div>
              </div>
            </div>
          </AntiGravityCard>
        </div>

        {/* CENTER COLUMN: Interactive Workspace */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-6 animate-fadeIn">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              
              {/* TAB 1: DASHBOARD HOME WIDGET GRID */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {dashboardLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      <p className="text-xs text-zinc-400 font-light">Loading live dashboard metrics...</p>
                    </div>
                  ) : dashboardError ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <ShieldAlert className="w-8 h-8 text-red-400" />
                      <p className="text-xs text-red-400 font-light">{dashboardError}</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <AntiGravityCard className="p-4 bg-zinc-950/40 border-white/5">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Active Scans</div>
                          <div className="text-xl font-bold font-mono mt-1 text-white">{kpiData?.active_jobs || 0} Active Jobs</div>
                        </AntiGravityCard>
                        <AntiGravityCard className="p-4 bg-zinc-950/40 border-white/5" floatRange={4}>
                          <div className="text-[10px] font-mono text-cyan-400 uppercase">Hidden Talent Uncovered</div>
                          <div className="text-xl font-bold font-mono mt-1 text-cyan-400">{kpiData?.hidden_talent || 0} Candidate Profiles</div>
                        </AntiGravityCard>
                        <AntiGravityCard className="p-4 bg-zinc-950/40 border-white/5">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Compliance Score</div>
                          <div className="text-xl font-bold font-mono mt-1 text-green-400">{kpiData?.compliance_score || 0}% Explainable</div>
                        </AntiGravityCard>
                        <AntiGravityCard className="p-4 bg-zinc-950/40 border-white/5" floatRange={5}>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Interview Loops</div>
                          <div className="text-xl font-bold font-mono mt-1 text-purple-400">{kpiData?.interview_loops || 0} Live Panels</div>
                        </AntiGravityCard>
                      </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                      <AntiGravityCard className="p-5 border-white/5 bg-black/20 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold">Active Recruitment Scans</h3>
                            <button onClick={() => handleTabChange("jobs")} className="text-[10px] text-primary-accent hover:underline flex items-center gap-0.5">
                              Manage all <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="space-y-2.5">
                            {jobs.map((job) => (
                              <div key={job.id} className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-semibold text-white">{job.title}</div>
                                  <div className="text-[10px] text-zinc-400 mt-0.5">{job.role} &bull; {job.dept} &bull; {job.matchCount} profiles indexed</div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded-full">
                                    {job.activeCandidates} active candidates
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsAddJobModalOpen(true)}
                          className="w-full mt-4 py-2 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-center text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Initialize New Job Description Scan
                        </button>
                      </AntiGravityCard>
                    </div>

                    <div className="lg:col-span-4">
                      <AntiGravityCard className="p-5 border-white/5 bg-black/20 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Skill Gap Index</h3>
                          <div className="w-full h-56 flex items-center justify-center">
                            {jobAnalyticsData?.skills_gap && jobAnalyticsData.skills_gap.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={jobAnalyticsData.skills_gap}>
                                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={8} />
                                  <Radar name="Role Requirement" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} />
                                  <Radar name="Candidate Pool Avg" dataKey="B" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                                </RadarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-zinc-500 h-full">
                                <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-[10px] font-mono">No skill gap data available.</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-center gap-4 text-[9px] text-zinc-400 font-mono mt-2">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-600" /> Target Requirement</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400" /> Candidate Avg</span>
                        </div>
                      </AntiGravityCard>
                    </div>

                    <div className="lg:col-span-6">
                      <AntiGravityCard className="p-5 border-white/5 bg-black/20 h-full flex flex-col justify-between" floatRange={4}>
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-cyan-400" />
                              Hidden Talent Spotlight™
                            </h3>
                            <button onClick={() => handleTabChange("candidates")} className="text-[10px] text-cyan-400 hover:underline">
                              View all rankings
                            </button>
                          </div>
                          {showSpotlight && spotlightCandidate ? (
                            <>
                              <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs shrink-0 flex items-center justify-center text-center">
                                  +{(spotlightCandidate.potentialScore || 0) - (spotlightCandidate.score || 0)}%
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-white">{spotlightCandidate.name}</h4>
                                    <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded">High Growth Offset</span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-light">
                                    Core skills match starts at {spotlightCandidate.score || 0}%, but adaptive learning signals raise their potential score to **{spotlightCandidate.potentialScore || 0}%**.
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-3 border-t border-white/5">
                                <span>Skills Match Gap: {(spotlightCandidate.potentialScore || 0) - (spotlightCandidate.score || 0)}% offset</span>
                                <Link 
                                  to={`/candidate/${spotlightCandidate.id}`}
                                  className="text-white hover:underline flex items-center gap-0.5"
                                >
                                  Investigate Match <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-500 h-full min-h-[120px]">
                              <ShieldAlert className="w-8 h-8 mb-2 opacity-50 text-cyan-400/50" />
                              <p className="text-[10px] font-mono text-center max-w-[200px]">No candidates with significant growth offset detected yet.</p>
                            </div>
                          )}
                        </div>
                      </AntiGravityCard>
                    </div>

                    <div className="lg:col-span-6">
                      <AntiGravityCard className="p-5 border-white/5 bg-black/20 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Hiring Funnel Trend</h3>
                          <div className="w-full h-36 flex items-center justify-center">
                            {jobAnalyticsData?.hiring_funnel_trend && jobAnalyticsData.hiring_funnel_trend.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={jobAnalyticsData.hiring_funnel_trend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                  <XAxis dataKey="month" stroke="#71717a" fontSize={9} />
                                  <YAxis stroke="#71717a" fontSize={9} />
                                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.08)", fontSize: 10 }} />
                                  <Area type="monotone" dataKey="avgScore" stroke="#8B5CF6" fill="rgba(139,92,246,0.15)" strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-zinc-500 h-full">
                                <BarChart3 className="w-6 h-6 mb-2 opacity-50" />
                                <p className="text-[10px] font-mono">Insufficient historical data to calculate trends.</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {jobAnalyticsData?.hiring_funnel_trend && jobAnalyticsData.hiring_funnel_trend.length > 0 && (
                          <div className="text-[10px] text-zinc-500 font-mono mt-2 flex items-center justify-between">
                            <span>Current Q2 Pipeline velocity</span>
                            <span className="text-purple-400 font-bold">+14% Growth</span>
                          </div>
                        )}
                      </AntiGravityCard>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

            {/* TAB 2: JOBS WORKSPACE */}
              {activeTab === "jobs" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">Recruitment Jobs Core</h2>
                      <p className="text-xs text-zinc-400 font-light mt-0.5">Parse, manage, and edit target criteria configurations.</p>
                    </div>
                    <button 
                      onClick={() => setIsAddJobModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-accent to-highlight text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                      <Plus className="w-4 h-4" /> Add Job Criteria
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <AntiGravityCard key={job.id} className="p-5 bg-black/40 border-white/5">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{job.dept}</span>
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{job.role}</p>
                        <p className="text-[10px] text-zinc-500 mt-2">{job.matchCount} candidate matches found</p>

                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-zinc-500">{job.activeCandidates} candidates active</span>
                          <button 
                            onClick={() => setSelectedJobId(job.id)}
                            className="text-primary-accent hover:underline flex items-center gap-0.5"
                          >
                            Configure criteria <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </AntiGravityCard>
                    ))}
                  </div>

                  <AntiGravityCard className="p-6 bg-black/40 border-white/10 mt-6">
                    <h3 className="text-sm font-semibold mb-4 text-white">
                      Parsed Skill Latents: {jobs.find(j => j.id === selectedJobId)?.title || "Senior Product Engineer"} ({jobs.find(j => j.id === selectedJobId)?.role || "Frontend UI Specialist"})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(jobs.find(j => j.id === selectedJobId)?.skills || ["React", "TypeScript", "Vite", "Zustand", "Framer Motion"]).map((skill, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs font-semibold text-zinc-300">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </AntiGravityCard>
                </div>
              )}              {/* TAB 3: CANDIDATE RANKINGS */}
              {activeTab === "candidates" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">Candidate Rankings</h2>
                      <p className="text-xs text-zinc-400 font-light mt-0.5">Semantic evaluation mapped to requirements.</p>
                    </div>
                    <div>
                      <label className="cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-primary-accent to-highlight text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        {resumeUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Resume</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={handleResumeUpload}
                          className="hidden"
                          disabled={resumeUploading}
                        />
                      </label>
                    </div>
                  </div>

                  {candidatesLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      <p className="text-xs text-zinc-400 font-light">Analyzing candidates against job requirements...</p>
                    </div>
                  ) : candidatesList.length === 0 ? (
                    <AntiGravityCard className="p-8 text-center bg-black/40 border-white/5 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Users className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">No candidates indexed yet</h3>
                        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-light leading-normal">
                          Upload candidate resumes (PDF, DOCX, TXT) to begin the AI semantic analysis and ranking matching.
                        </p>
                      </div>
                    </AntiGravityCard>
                  ) : (
                    <div className="space-y-4">
                      {candidatesList.map((cand) => (
                        <AntiGravityCard 
                          key={cand.id} 
                          onClick={() => navigate(`/candidate/${cand.id}`)}
                          className="p-5 bg-black/40 border-white/5 hover:border-primary-accent/40 cursor-pointer"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                                {cand.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold text-white">{cand.name}</h3>
                                  <span className={`text-[9px] px-2 py-0.5 rounded border ${
                                    cand.badge === "Hidden Talent" 
                                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                      : "bg-primary-accent/10 border-primary-accent/20 text-primary-accent"
                                  }`}>
                                    {cand.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">
                                  {jobs.find(j => j.id === selectedJobId)?.title || "Candidate"} &bull; {cand.experience}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-[10px] text-zinc-500 font-mono">Semantic Score</div>
                                <div className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-1.5">
                                  {cand.score}% 
                                  {cand.potentialScore && (
                                    <span className="text-xs text-green-400">(+{cand.potentialScore - cand.score}% Potential)</span>
                                  )}
                                </div>
                              </div>
                              <button className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium transition-colors">
                                Inspect Match
                              </button>
                            </div>
                          </div>
                        </AntiGravityCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: EXPLAINABLE MATCH REPLAY */}
              {activeTab === "replay" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Explainable Match Replay™</h2>
                    <p className="text-xs text-zinc-400 font-light mt-0.5">Simulate scoring builder process to verify decision criteria transparency.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    <div className="md:col-span-5 space-y-4">
                      <AntiGravityCard className="p-5 bg-black/40 border-white/5">
                        <h3 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Select Candidate to Audit</h3>
                        <div className="space-y-2">
                          {candidatesList.map((cand) => (
                            <button
                              key={cand.id}
                              onClick={() => setReplaySequenceStage(0)}
                              className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                            >
                              <div>
                                <div className="text-xs font-semibold text-white">{cand.name}</div>
                                <div className="text-[10px] text-zinc-500">{cand.role}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-600" />
                            </button>
                          ))}
                        </div>
                      </AntiGravityCard>
                    </div>

                    <div className="md:col-span-7">
                      <AntiGravityCard className="p-6 bg-black/40 border-white/10 relative h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                            <span className="text-xs font-mono text-zinc-500">EXPLANATION SEQUENCE</span>
                            <span className="text-2xl font-bold text-highlight font-mono">
                              {replaySequenceStage === 0 ? "0%" : replaySequenceStage === 1 ? "35%" : replaySequenceStage === 2 ? "60%" : replaySequenceStage === 3 ? "75%" : replaySequenceStage === 4 ? "85%" : "95%"}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            <div className={`p-2.5 rounded-lg border text-xs flex justify-between ${replaySequenceStage >= 1 ? "bg-white/5 border-white/10 text-white" : "border-white/5 text-zinc-700"}`}>
                              <span>React Core Matcher</span>
                              <span className={replaySequenceStage >= 1 ? "text-cyan-400" : "text-zinc-700"}>+35</span>
                            </div>
                            <div className={`p-2.5 rounded-lg border text-xs flex justify-between ${replaySequenceStage >= 2 ? "bg-white/5 border-white/10 text-white" : "border-white/5 text-zinc-700"}`}>
                              <span>Production Scale Experience</span>
                              <span className={replaySequenceStage >= 2 ? "text-cyan-400" : "text-zinc-700"}>+25</span>
                            </div>
                            <div className={`p-2.5 rounded-lg border text-xs flex justify-between ${replaySequenceStage >= 3 ? "bg-white/5 border-white/10 text-white" : "border-white/5 text-zinc-700"}`}>
                              <span>Open-Source & Project Contributions</span>
                              <span className={replaySequenceStage >= 3 ? "text-cyan-400" : "text-zinc-700"}>+15</span>
                            </div>
                            <div className={`p-2.5 rounded-lg border text-xs flex justify-between ${replaySequenceStage >= 4 ? "bg-white/5 border-white/10 text-white" : "border-white/5 text-zinc-700"}`}>
                              <span>Product Ownership & Leadership</span>
                              <span className={replaySequenceStage >= 4 ? "text-cyan-400" : "text-zinc-700"}>+10</span>
                            </div>
                            <div className={`p-2.5 rounded-lg border text-xs flex justify-between ${replaySequenceStage >= 5 ? "bg-white/5 border-white/10 text-white" : "border-white/5 text-zinc-700"}`}>
                              <span>Transferable Learning Potential</span>
                              <span className={replaySequenceStage >= 5 ? "text-cyan-400" : "text-zinc-700"}>+10</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                          <button
                            onClick={() => setReplaySequenceStage(0)}
                            className="px-4 py-2 border border-white/10 rounded-full text-xs text-zinc-400 hover:text-white"
                          >
                            Reset Sequence
                          </button>
                          <button
                            onClick={() => setReplaySequenceStage(Math.min(replaySequenceStage + 1, 5))}
                            className="flex-1 py-2 bg-primary-accent hover:bg-primary-accent/80 rounded-full text-xs text-white font-semibold"
                          >
                            Build Score Factor
                          </button>
                        </div>
                      </AntiGravityCard>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AI COPILOT QUESTIONS */}
              {activeTab === "copilot" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">AI Interview Copilot</h2>
                    <p className="text-xs text-zinc-400 font-light mt-0.5">Generated contextual questions with confidence and audit directives.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AntiGravityCard className="p-5 bg-black/40 border-white/5">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Technical Interview Pack</div>
                      <h4 className="text-sm font-semibold text-white mb-2">&ldquo;How do you structure custom hook optimizations inside deep React trees to avoid unneeded renders?&rdquo;</h4>
                      <p className="text-xs text-zinc-400 leading-normal mb-4 font-light">Target focus: Optimization capability for high-fidelity animations and React state trees.</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Relevance: 98% (Sarah Jenkins)</span>
                        <span className="text-green-400">Confidence: Extreme</span>
                      </div>
                    </AntiGravityCard>

                    <AntiGravityCard className="p-5 bg-black/40 border-white/5">
                      <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2">Behavioral Leadership Pack</div>
                      <h4 className="text-sm font-semibold text-white mb-2">&ldquo;Tell us about a time you had to pivot a frontend application architecture late in the design phase.&rdquo;</h4>
                      <p className="text-xs text-zinc-400 leading-normal mb-4 font-light">Target focus: Adaptability, architectural ownership, communication skills.</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Relevance: 91% (Marcus Vance)</span>
                        <span className="text-purple-400">Confidence: Strong</span>
                      </div>
                    </AntiGravityCard>
                  </div>
                </div>
              )}

              {/* TAB 6: ANALYTICS HUB */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Hiring Analytics Hub</h2>
                    <p className="text-xs text-zinc-400 font-light mt-0.5">Unified pipelines, candidate match statistics, and skill allocations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AntiGravityCard className="p-5 bg-black/40 border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Candidate Categories</h3>
                        <div className="w-full h-48 flex items-center justify-center">
                          {kpiData?.candidate_distribution && kpiData.candidate_distribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={kpiData.candidate_distribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {kpiData.candidate_distribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.08)", fontSize: 10 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-500 h-full">
                              <BarChart3 className="w-6 h-6 mb-2 opacity-50" />
                              <p className="text-[10px] font-mono">No category distribution available.</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-around text-[10px] text-zinc-400 font-mono mt-4">
                        {kpiData?.candidate_distribution?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span>{entry.name} ({entry.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </AntiGravityCard>

                    <AntiGravityCard className="p-5 bg-black/40 border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Required vs Candidate Core Skills</h3>
                        <div className="w-full h-48 flex items-center justify-center">
                          {jobAnalyticsData?.skills_gap && jobAnalyticsData.skills_gap.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={jobAnalyticsData.skills_gap}>
                                <XAxis dataKey="subject" stroke="#71717a" fontSize={8} />
                                <YAxis stroke="#71717a" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.08)", fontSize: 10 }} />
                                <Bar dataKey="A" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="B" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-500 h-full">
                              <BarChart3 className="w-6 h-6 mb-2 opacity-50" />
                              <p className="text-[10px] font-mono">No skill gap comparison available.</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-4 text-center">
                        Purple: Required Benchmark | Cyan: Pool Average
                      </div>
                    </AntiGravityCard>
                  </div>
                </div>
              )}

              {/* TAB 7: SETTINGS */}
              {activeTab === "settings" && (
                <AntiGravityCard className="p-6 bg-black/40 border-white/5">
                  <h2 className="text-base font-bold text-white mb-4">Recruiter Operating System Settings</h2>
                  <div className="space-y-4 text-xs">
                    <div className="p-3 border border-white/5 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">Semantic Latent Threshold</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Tolerance limit for mapping adjacent technical capabilities.</div>
                      </div>
                      <input type="range" className="accent-primary-accent" defaultValue="85" />
                    </div>

                    <div className="p-3 border border-white/5 rounded-xl bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">Copilot Proactivity</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Permits the agent to proactively suggest question sheets during parses.</div>
                      </div>
                      <input type="checkbox" className="accent-primary-accent" defaultChecked />
                    </div>
                  </div>
                </AntiGravityCard>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Persistent AI Copilot Panel */}
        <div className="w-80 pb-6 hidden xl:block animate-fadeIn">
          <CopilotPanel />
        </div>

      </div>

      {/* Add Job Criteria Modal */}
      <AnimatePresence>
        {isAddJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddJobModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-[900px] bg-zinc-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.2)] relative z-10 backdrop-blur-xl max-h-[90vh] flex flex-col text-xs"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm tracking-wide text-white uppercase font-mono">ATS Recruitment Workspace</h3>
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">Establish criteria rules, leverage generative intelligence, and auto-match candidate pools.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddJobModalOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 scrollbar-thin">
                
                {/* LEFT COLUMN: Input Info Fields */}
                <div className="space-y-4">
                  {/* Section: Company Information */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                    <div className="text-[10px] uppercase text-cyan-400 font-bold font-mono tracking-wider">Company Information</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Company Name *</label>
                        <input
                          type="text"
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                          placeholder="e.g. Linear"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Department *</label>
                        <select
                          value={formDept}
                          onChange={(e) => setFormDept(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg text-white text-xs px-2 py-1.5 focus:border-cyan-500/50 outline-none"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Design">Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Location</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Remote (US/EU)"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Employment Type</label>
                        <select
                          value={formEmpType}
                          onChange={(e) => setFormEmpType(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg text-white text-xs px-2 py-1.5 focus:border-cyan-500/50 outline-none"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Job Information */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                    <div className="text-[10px] uppercase text-cyan-400 font-bold font-mono tracking-wider">Job Information</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Job Title *</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Senior Product Engineer"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Role Category</label>
                        <input
                          type="text"
                          value={formRoleCat}
                          onChange={(e) => setFormRoleCat(e.target.value)}
                          placeholder="e.g. Frontend UI Specialist"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Experience Required</label>
                        <input
                          type="text"
                          value={formExperience}
                          onChange={(e) => setFormExperience(e.target.value)}
                          placeholder="e.g. 8+ years"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Salary Range</label>
                        <input
                          type="text"
                          value={formSalary}
                          onChange={(e) => setFormSalary(e.target.value)}
                          placeholder="e.g. $150k - $190k"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg text-white text-xs px-2.5 py-1.5 focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Job Description Source */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                    <div className="text-[10px] uppercase text-zinc-400 font-bold font-mono tracking-wider">Job Description Document</div>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer flex flex-col items-center justify-center relative bg-white/[0.005] ${
                        dragActive ? "border-cyan-400 bg-cyan-400/5" : "border-white/10 hover:border-white/15"
                      }`}
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.txt"
                      />
                      <UploadCloud className="w-6 h-6 text-zinc-500 mb-1" />
                      <p className="text-zinc-400 font-medium text-[11px]">Drop JD File here or click to browse</p>
                      <p className="text-[9px] text-zinc-600">PDF, DOCX, TXT formats supported</p>
                    </div>

                    {uploadedFile && (
                      <div className="p-2 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center justify-between text-zinc-300">
                        <span className="truncate max-w-[80%] font-mono text-[10px]">{uploadedFile.name}</span>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      </div>
                    )}

                    <div>
                      <textarea
                        placeholder="Or paste the job description text details manually here..."
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        className="w-full h-20 bg-white/[0.01] border border-white/5 rounded-xl text-white placeholder-zinc-600 text-xs px-2.5 py-2 focus:border-cyan-500/50 outline-none resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Requirements & AI Analysis */}
                <div className="space-y-4 flex flex-col justify-between">
                  {/* Section: Tag Inputs for Requirements */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                    <div className="text-[10px] uppercase text-cyan-400 font-bold font-mono tracking-wider">Candidate Target Requirements</div>
                    
                    {/* Required Skills Tag Input */}
                    <div>
                      <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Required Hard Skills (Press Enter)</label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.02] border border-white/5 rounded-lg min-h-[40px] items-center mb-1.5">
                        {formReqSkills.map((skill, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                            {skill}
                            <button type="button" onClick={() => removeRequiredSkill(skill)} className="text-zinc-500 hover:text-white">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={reqSkillInput}
                          onChange={(e) => setReqSkillInput(e.target.value)}
                          onKeyDown={addRequiredSkill}
                          placeholder={formReqSkills.length === 0 ? "e.g. React, TypeScript..." : ""}
                          className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-600 flex-1 min-w-[60px]"
                        />
                      </div>
                    </div>

                    {/* Preferred Skills Tag Input */}
                    <div>
                      <label className="text-[9px] text-zinc-500 uppercase font-medium mb-1 block font-mono">Preferred Skills (Optional)</label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.02] border border-white/5 rounded-lg min-h-[40px] items-center">
                        {formPrefSkills.map((skill, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                            {skill}
                            <button type="button" onClick={() => removePreferredSkill(skill)} className="text-zinc-500 hover:text-white">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={prefSkillInput}
                          onChange={(e) => setPrefSkillInput(e.target.value)}
                          onKeyDown={addPreferredSkill}
                          placeholder={formPrefSkills.length === 0 ? "e.g. Web3, Docker..." : ""}
                          className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-600 flex-1 min-w-[60px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: AI Analysis & Extraction Outputs */}
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-cyan-400 font-bold font-mono tracking-wider mb-2">Generative Intelligence Parsing</div>
                      
                      {!hasAnalyzed ? (
                        <button
                          type="button"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="w-full py-3 rounded-full bg-zinc-950/40 border border-white/10 hover:border-white/20 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Auto-Extracting Skills & Experience...
                            </>
                          ) : (
                            <>
                              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> Extract with HireFlow AI
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-2 bg-green-500/5 border border-green-500/10 rounded-xl flex items-center gap-2 text-[10px] text-green-400">
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                            <span>Explainable AI successfully extracted and autofilled job details.</span>
                          </div>

                          {extractedResponsibilities.length > 0 && (
                            <div>
                              <div className="text-[9px] text-zinc-500 uppercase font-mono mb-1">Extracted Key Responsibilities</div>
                              <ul className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5 max-h-[110px] overflow-y-auto">
                                {extractedResponsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-[9px] text-zinc-400 leading-normal flex items-start gap-1">
                                    <span className="text-cyan-400 shrink-0 mt-0.5">&bull;</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {hasAnalyzed && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-[10px] text-zinc-500 hover:text-white underline text-left mt-2 block w-max"
                      >
                        Reset & Clear Fields
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Error indicator */}
              {error && (
                <div className="mx-6 mb-3 text-red-400 text-[10px] bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              {/* Actions Footer */}
              <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 bg-black/40">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-5 py-2 rounded-full border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-medium"
                >
                  Save Draft
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCreateJob}
                    className="px-6 py-2 rounded-full bg-zinc-900 border border-white/10 hover:border-white/20 text-white font-semibold"
                  >
                    Create Job Criteria Only
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyzeAndMatch}
                    disabled={isMatching}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-accent to-highlight text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
                  >
                    {isMatching ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Matching Candidates...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Analyze & Match Candidates
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
