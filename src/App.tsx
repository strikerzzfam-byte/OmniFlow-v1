import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import OmniWrite from "./pages/OmniWrite";
import OmniDesign from "./pages/OmniDesign";
import OmniGenerate from "./pages/OmniGenerate";
import DashboardSettings from "./pages/DashboardSettings";
import Roadmap from "./pages/Roadmap";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
          <Route path="/dashboard" element={<DashboardLayout><PageTransition><Dashboard /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omniwrite" element={<DashboardLayout><PageTransition><OmniWrite /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omnidesign" element={<DashboardLayout><PageTransition><OmniDesign /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/omnigenerate" element={<DashboardLayout><PageTransition><OmniGenerate /></PageTransition></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><PageTransition><DashboardSettings /></PageTransition></DashboardLayout>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
