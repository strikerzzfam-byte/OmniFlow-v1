import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import OmniWrite from "./pages/OmniWrite";
import OmniDesign from "./pages/OmniDesign";
import EnhancedOmniDesign from "./pages/EnhancedOmniDesign";
import WorkingOmniDesign from "./pages/WorkingOmniDesign";
import FixedOmniDesign from "./pages/FixedOmniDesign";
import CompleteOmniDesign from "./pages/CompleteOmniDesign";
import FinalOmniDesign from "./pages/FinalOmniDesign";
import OmniGenerate from "./pages/OmniGenerate";
import NewOmniGenerate from "./pages/OmniGenerate";
import DashboardSettings from "./pages/DashboardSettings";
import Roadmap from "./pages/Roadmap";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";

import { AuthUI } from "./components/ui/auth-fuse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><AuthUI /></PageTransition>} />
          <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
          <Route path="/dashboard" element={<DashboardLayout><PageTransition><Dashboard /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omniwrite" element={<DashboardLayout><PageTransition><OmniWrite /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omnidesign" element={<PageTransition><CompleteOmniDesign /></PageTransition>} />
          <Route path="/dashboard/omnidesign-fixed" element={<PageTransition><FixedOmniDesign /></PageTransition>} />
          <Route path="/dashboard/omnidesign-working" element={<PageTransition><WorkingOmniDesign /></PageTransition>} />
          <Route path="/dashboard/omnidesign-enhanced" element={<PageTransition><EnhancedOmniDesign /></PageTransition>} />
          <Route path="/dashboard/omnidesign-classic" element={<DashboardLayout><PageTransition><OmniDesign /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omnigenerate" element={<PageTransition><NewOmniGenerate /></PageTransition>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><PageTransition><DashboardSettings /></PageTransition></DashboardLayout>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
