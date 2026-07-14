import { useState, useEffect } from "react";
import { Loader2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import InteractiveCanvas from "./components/InteractiveCanvas";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import AdminDashboard from "./components/AdminDashboard";
import { PortfolioData } from "./types";

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // Default to dark theme as requested ("Implement a modern dark theme with a toggle button for light mode.")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved !== "light"; // default true (dark) if not set
  });

  // Administrative State
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem("portfolio-admin-token") || "";
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync dark class on document root (Tailwind v4 standard)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
    }
  }, [isDarkMode]);

  // Load public portfolio data on mount
  const fetchPortfolioData = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
      } else {
        console.error("Server error retrieving portfolio data.");
      }
    } catch (err) {
      console.error("Network error loading portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("portfolio-admin-token", token);
    setShowAdminDashboard(true);
  };

  const handleLogout = () => {
    setAdminToken("");
    localStorage.removeItem("portfolio-admin-token");
    setShowAdminDashboard(false);
  };

  // Re-fetch database state to update components on dashboard edits
  const handleRefreshData = () => {
    fetchPortfolioData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 font-sans">
        <div className="relative p-6 flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
          <span className="font-display font-medium text-lg tracking-wider text-purple-400">
            Md. Sahadat Hossain
          </span>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Initializing Portfolio Assets...</p>
        </div>
      </div>
    );
  }

  // Fallback default state if data read fails
  const data = portfolioData || {
    about: {
      name: "Md. Sahadat Hossain",
      role: "Full-Stack Web Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      bio: "MERN Stack Web Developer from Bangladesh.",
      email: "fiverrprince34@gmail.com",
      phone: "",
      location: "Bangladesh",
      education: "",
      experience: "",
      resumeUrl: ""
    },
    skills: [],
    projects: [],
    blogs: [],
    socialLinks: { github: "", linkedin: "", facebook: "", twitter: "" }
  };

  return (
    <div className="min-h-screen relative bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* Dynamic Network Node Hover Canvas & Trail */}
      <InteractiveCanvas isDarkMode={isDarkMode} />

      {/* Shared Navigation Bar */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={handleToggleTheme}
        isAdminLoggedIn={!!adminToken}
        onAdminClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        showAdminDashboard={showAdminDashboard}
        setShowAdminDashboard={setShowAdminDashboard}
        about={data.about}
      />

      {/* Main Content Area */}
      <main id="app-view-container" className="relative z-10">
        {showAdminDashboard && adminToken ? (
          /* Secure Administrative CMS View */
          <AdminDashboard
            token={adminToken}
            onLogout={handleLogout}
            onRefreshData={handleRefreshData}
            portfolioData={data}
          />
        ) : (
          /* Standard Public Portfolio Layout */
          <>
            <HomeSection about={data.about} socials={data.socialLinks} />
            <AboutSection about={data.about} />
            <SkillsSection skills={data.skills} />
            <ProjectsSection projects={data.projects} />
            <BlogSection blogs={data.blogs} />
            <ContactSection about={data.about} />
            <Footer about={data.about} socials={data.socialLinks} />
          </>
        )}
      </main>

      {/* Sleek Passcode Login Panel Triggered from Navbar */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
