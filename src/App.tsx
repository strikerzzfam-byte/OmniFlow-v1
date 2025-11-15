import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AvatarProvider } from "./contexts/AvatarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { AuthUI } from "./components/ui/auth-fuse";
import OmniWrite from "./pages/OmniWrite";
import OmniDesign from "./pages/OmniDesign";
import OmniGenerate from "./pages/OmniGenerate";
import DashboardSettings from "./pages/DashboardSettings";
import Roadmap from "./pages/Roadmap";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AvatarProvider>
        <ThemeProvider>
          <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthUI /></PageTransition>} />
            <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PageTransition><Dashboard /></PageTransition>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/omniwrite" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PageTransition><OmniWrite /></PageTransition>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/omnidesign" element={
              <ProtectedRoute>
                <PageTransition><OmniDesign /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/omnigenerate" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PageTransition><OmniGenerate /></PageTransition>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PageTransition><DashboardSettings /></PageTransition>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AvatarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
