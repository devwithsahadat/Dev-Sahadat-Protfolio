import { ArrowUp, Github, Linkedin, Facebook, Twitter, Heart } from "lucide-react";
import { AboutData, SocialLinks } from "../types";

interface FooterProps {
  about: AboutData;
  socials: SocialLinks;
}

export default function Footer({ about, socials }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Closing Bio */}
          <div className="text-center md:text-left space-y-2 max-w-md">
            <span className="font-display font-bold text-lg bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              {about.name || "Md. Sahadat Hossain"}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Full-Stack Developer specializing in high-performance React and MERN applications. Creating elegant, scale-ready solutions for business and tech.
            </p>
          </div>

          {/* Social Quick Links */}
          <div className="flex items-center space-x-4">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 hover:border-purple-300 transition-all shadow-xs"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 hover:border-purple-300 transition-all shadow-xs"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 hover:border-purple-300 transition-all shadow-xs"
                aria-label="Facebook Profile"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 hover:border-purple-300 transition-all shadow-xs"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Back to top anchor */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            title="Scroll To Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-150 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-center gap-4">
          <p className="text-[11px] font-mono tracking-wide text-zinc-400">
            © {new Date().getFullYear()} Md. Sahadat Hossain. All rights reserved.
          </p>
          <p className="text-[11px] font-mono tracking-wide text-zinc-400 flex items-center justify-center">
            <span>Built with React, Vite & Tailwind</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-1.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
