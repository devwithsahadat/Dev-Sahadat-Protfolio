import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Lock, LayoutDashboard, LogOut } from "lucide-react";
import { AboutData } from "../types";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  showAdminDashboard: boolean;
  setShowAdminDashboard: (val: boolean) => void;
  about: AboutData;
}

export default function Navbar({
  isDarkMode,
  toggleTheme,
  isAdminLoggedIn,
  onAdminClick,
  onLogout,
  showAdminDashboard,
  setShowAdminDashboard,
  about
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track scrolling to add sticky styling and update scrollspy active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["home", "about", "skills", "projects", "blogs", "contact"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    setShowAdminDashboard(false);
    
    // Slight timeout to let dashboard close before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => handleNavClick("home")}>
            {about.logoType === "image" && about.logoImage ? (
              <img
                src={about.logoImage}
                alt={about.logoText || about.name || "Logo"}
                className="h-9 w-auto object-contain rounded-lg max-w-[160px] transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                {about.logoText || about.name || "Sahadat Hossain"}
              </span>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!showAdminDashboard ? (
              <div className="flex items-baseline space-x-1 lg:space-x-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === link.id
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("home")}
                className="px-4 py-2 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-300 hover:text-purple-500 cursor-pointer"
              >
                ← Back to Portfolio
              </button>
            )}

            {/* Actions (Theme Toggle & Admin Option) */}
            <div className="flex items-center space-x-3 border-l pl-5 border-zinc-200 dark:border-zinc-800">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
              </button>

              {isAdminLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      showAdminDashboard
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                        : "bg-zinc-100 dark:bg-zinc-900 text-purple-600 dark:text-purple-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Logout Admin"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdminClick}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  showAdminDashboard ? "text-purple-500" : "text-zinc-500 dark:text-zinc-400"
                }`}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 transition-all duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {!showAdminDashboard ? (
              navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                    activeSection === link.id
                      ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-purple-500"
                  }`}
                >
                  {link.label}
                </button>
              ))
            ) : (
              <button
                onClick={() => handleNavClick("home")}
                className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-purple-600 dark:text-purple-400 font-bold"
              >
                ← Back to Portfolio
              </button>
            )}

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2 px-3">
              {isAdminLoggedIn ? (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setShowAdminDashboard(!showAdminDashboard);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-medium py-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{showAdminDashboard ? "Close Dashboard" : "Open Dashboard"}</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-1 text-rose-500 text-sm font-medium py-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAdminClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-md text-sm font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin Access</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
