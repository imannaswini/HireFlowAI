import { create } from "zustand";

export interface Job {
  id: string;
  title: string;
  role: string;
  dept: string;
  matchCount: number;
  activeCandidates: number;
  status: string;
  skills?: string[];
  experience?: string;
  softSkills?: string[];
  seniority?: string;
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isShortlisted: Record<string, boolean>;
  toggleShortlist: (candidateId: string) => void;
  replaySequenceStage: number;
  setReplaySequenceStage: (stage: number) => void;
  incrementReplayStage: () => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  setJobs: (jobs: Job[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedJobId: "job-1",
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isShortlisted: {},
  toggleShortlist: (candidateId) =>
    set((state) => ({
      isShortlisted: {
        ...state.isShortlisted,
        [candidateId]: !state.isShortlisted[candidateId],
      },
    })),
  replaySequenceStage: 0,
  setReplaySequenceStage: (stage) => set({ replaySequenceStage: stage }),
  incrementReplayStage: () =>
    set((state) => ({
      replaySequenceStage: Math.min(state.replaySequenceStage + 1, 5),
    })),
  jobs: [
    { id: "job-1", title: "Senior Product Engineer", role: "Frontend UI Specialist", dept: "Engineering", matchCount: 42, activeCandidates: 14, status: "Active", skills: ["React", "TypeScript", "Vite SPA Bundler", "Framer Motion", "Zustand"], experience: "8+ years", softSkills: ["Mentorship", "System Design", "Ownership"], seniority: "Senior" },
    { id: "job-2", title: "Lead Product Manager", role: "Core Growth PM", dept: "Product", matchCount: 28, activeCandidates: 8, status: "Active", skills: ["Product Roadmap", "Metrics Tracking", "User Research"], experience: "7+ years", softSkills: ["Communication", "Prioritization", "Cross-functional Leadership"], seniority: "Lead" },
    { id: "job-3", title: "Distributed Systems Engineer", role: "Cloud Infrastructure Engineer", dept: "Infrastructure", matchCount: 19, activeCandidates: 5, status: "Active", skills: ["Go", "Kubernetes", "gRPC", "Docker"], experience: "5+ years", softSkills: ["Problem Solving", "Collaboration"], seniority: "Mid-Senior" },
  ],
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  setJobs: (jobs) => set({ jobs }),
}));
