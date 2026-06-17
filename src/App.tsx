import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CandidateIntelligence from "./pages/CandidateIntelligence";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<Dashboard />} />
      <Route path="/candidates" element={<Dashboard />} />
      <Route path="/replay" element={<Dashboard />} />
      <Route path="/copilot" element={<Dashboard />} />
      <Route path="/analytics" element={<Dashboard />} />
      <Route path="/settings" element={<Dashboard />} />
      <Route path="/candidate/:id" element={<CandidateIntelligence />} />
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
