import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./views/Index";
import NotFound from "./views/NotFound";
import Auth from "./views/Auth";
import Admin from "./views/Admin";
import Guestbook from "./views/Guestbook";
import Profile from "./views/Profile";
import News from "./views/News";
import Guide from "./views/Guide";
import QnA from "./views/QnA";
import Contact from "./views/Contact";
import Category from "./views/Category";
import AboutAka from "./views/AboutZekk";
import AboutLia from "./views/AboutLia";
import LoveCalculator from "./views/LoveCalculator";
import { AuthProvider } from "@/context/AuthContext";
import { RouteTransition } from "@/components/garden/RouteTransition";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SfxProvider } from "@/context/SfxContext";
import { SiteHeader } from "@/components/garden/SiteHeader";
import { FloatingDecorations } from "@/components/garden/FloatingDecorations";
import { QuickNav } from "@/components/garden/QuickNav";
import { MusicPlayer } from "@/components/garden/MusicPlayer";
import { MemoryProvider } from "@/context/MemoryContext";
import { MusicProvider } from "@/context/MusicContext";
import Memories from "@/views/Memories";
import Playlist from "@/views/Playlist";
import Travel from "@/views/Travel";
import Letters from "@/views/Letters";

// Hidden Admin Views (not in public navigation - access via /__admin/login)
import AdminLogin from "@/views/admin/AdminLogin";
import AdminDashboard from "@/views/admin/AdminDashboard";
import AdminMemories from "@/views/admin/AdminMemories";
import AdminNews from "@/views/admin/AdminNews";
import AdminJourney from "@/views/admin/AdminJourney";
import AdminProfiles from "@/views/admin/AdminProfiles";
import AdminContact from "@/views/admin/AdminContact";
import AdminGallery from "@/views/admin/AdminGallery";
import AdminTravel from "@/views/admin/AdminTravel";
import AdminVisitors from "@/views/admin/AdminVisitors";
import AdminLetters from "@/views/admin/AdminLetters";
import { RequireAdmin } from "@/components/admin/RequireAdmin";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <RouteTransition>
              <Index />
            </RouteTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <RouteTransition>
              <Auth />
            </RouteTransition>
          }
        />
        <Route
          path="/guestbook"
          element={
            <RouteTransition>
              <Guestbook />
            </RouteTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteTransition>
              <Admin />
            </RouteTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteTransition>
              <Profile />
            </RouteTransition>
          }
        />
        <Route
          path="/news"
          element={
            <RouteTransition>
              <News />
            </RouteTransition>
          }
        />
        <Route
          path="/guide"
          element={
            <RouteTransition>
              <Guide />
            </RouteTransition>
          }
        />
        <Route
          path="/qna"
          element={
            <RouteTransition>
              <QnA />
            </RouteTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <RouteTransition>
              <Contact />
            </RouteTransition>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <RouteTransition>
              <Category />
            </RouteTransition>
          }
        />
        <Route
          path="/about-aka"
          element={
            <RouteTransition>
              <AboutAka />
            </RouteTransition>
          }
        />
        <Route
          path="/about-lia"
          element={
            <RouteTransition>
              <AboutLia />
            </RouteTransition>
          }
        />
        <Route
          path="/memories"
          element={
            <RouteTransition>
              <Memories />
            </RouteTransition>
          }
        />
        <Route
          path="/calculator"
          element={
            <RouteTransition>
              <LoveCalculator />
            </RouteTransition>
          }
        />
        <Route
          path="/travel"
          element={
            <RouteTransition>
              <Travel />
            </RouteTransition>
          }
        />
        <Route
          path="/playlist"
          element={
            <RouteTransition>
              <Playlist />
            </RouteTransition>
          }
        />
        <Route
          path="/letters"
          element={
            <RouteTransition>
              <Letters />
            </RouteTransition>
          }
        />

        {/* ============ HIDDEN ADMIN ROUTES ============ */}
        {/* These routes are not in public navigation, accessed via /__admin/login */}
        <Route path="/__admin/login" element={<AdminLogin />} />
        <Route
          path="/__admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/memories"
          element={
            <RequireAdmin>
              <AdminMemories />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/news"
          element={
            <RequireAdmin>
              <AdminNews />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/journey"
          element={
            <RequireAdmin>
              <AdminJourney />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/profiles"
          element={
            <RequireAdmin>
              <AdminProfiles />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/contact"
          element={
            <RequireAdmin>
              <AdminContact />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/gallery"
          element={
            <RequireAdmin>
              <AdminGallery />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/letters"
          element={
            <RequireAdmin>
              <AdminLetters />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/travel"
          element={
            <RequireAdmin>
              <AdminTravel />
            </RequireAdmin>
          }
        />
        <Route
          path="/__admin/visitors"
          element={
            <RequireAdmin>
              <AdminVisitors />
            </RequireAdmin>
          }
        />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <RouteTransition>
              <NotFound />
            </RouteTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Disable right-click context menu and keyboard shortcuts
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+U, Ctrl+S) but allow Ctrl+K for QuickNav
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) {
        e.preventDefault();
      }
      // Allow Ctrl+K for QuickNav
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <MemoryProvider>
            <MusicProvider>
              <SfxProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    {/* Floating kawaii decorations */}
                    <FloatingDecorations />

                    {/* Quick Navigation - Ctrl+K to open */}
                    <QuickNav />

                    {/* Persistent Music Player */}
                    <MusicPlayer />

                    {/* Keep header outside of RouteTransition transforms so `position: sticky` works reliably */}
                    {/* <SiteHeader /> */}

                    {/* Offset content so it doesn't hide behind the sticky header */}
                    <div style={{ paddingTop: "var(--site-header-h, 0px)" }}>
                      <AnimatedRoutes />
                    </div>
                  </BrowserRouter>
                </TooltipProvider>
              </SfxProvider>
            </MusicProvider>
          </MemoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

