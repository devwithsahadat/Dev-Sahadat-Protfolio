import { useState, useEffect } from "react";
import { ArrowRight, Github, Linkedin, Facebook, Twitter, Mail, Download, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { AboutData, SocialLinks } from "../types";

interface HomeSectionProps {
  about: AboutData;
  socials: SocialLinks;
}

export default function HomeSection({ about, socials }: HomeSectionProps) {
  const [typedRole, setTypedRole] = useState("");
  const roles = [
    "Full-Stack Web Developer",
    "MERN Stack Specialist",
    "TypeScript Enthusiast",
    "Clean Code Advocate"
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect loop
  useEffect(() => {
    const activeRole = roles[currentRoleIndex];
    let typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === activeRole.length) {
      // Pause before deleting
      typingSpeed = 2000;
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      typingSpeed = 500;
    }

    const timer = setTimeout(() => {
      setTypedRole(
        isDeleting
          ? activeRole.substring(0, charIndex - 1)
          : activeRole.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentRoleIndex]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-zinc-950/30"
    >
      {/* Background radial soft light blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl animate-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl animate-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center justify-center text-center pt-8 pb-36 sm:pb-48">
        {/* Profile Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-300 text-xs font-semibold tracking-wider uppercase mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>Available for Freelance & Remote Work</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-zinc-900 dark:text-white max-w-4xl"
        >
          Hi, I am{" "}
          <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 bg-clip-text text-transparent">
            {about.name || "Md. Nijam Hossen"}
          </span>
        </motion.h1>

        {/* Typewriting subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-xl sm:text-2xl font-medium text-zinc-600 dark:text-zinc-300 h-8"
        >
          <span>A </span>
          <span className="text-purple-600 dark:text-purple-400 font-bold typing-cursor font-display">
            {typedRole}
          </span>
        </motion.div>

        {/* Brief Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
        >
          {about.bio || "Crafting modern, accessible, and ultra-fast Full-Stack web solutions. Specializing in Node.js, React, Express, MongoDB, and TypeScript."}
        </motion.p>

        {/* Social Quick Links */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-12 sm:mt-16 flex items-center space-x-4"
        >
          {socials.github && (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 shadow-xs transition-all duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          )}
          {socials.linkedin && (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 shadow-xs transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          )}
          {socials.facebook && (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 shadow-xs transition-all duration-200"
              aria-label="Facebook Profile"
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
          )}
          {socials.twitter && (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 shadow-xs transition-all duration-200"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          )}
          {about.email && (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${about.email}`}
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 shadow-xs transition-all duration-200"
              aria-label="Send Email"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          )}
        </motion.div>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 w-full max-w-md sm:max-w-none px-4 sm:px-0"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <span>Let's Collaborate</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("projects")}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
          >
            <span>View Featured Work</span>
          </motion.button>
        </motion.div>

        {/* Scroll down indicator mouse */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 cursor-pointer opacity-70 hover:opacity-100 hidden sm:flex"
          onClick={() => scrollToSection("about")}
        >
          <div className="w-6 h-10 border-2 border-zinc-400 dark:border-zinc-600 rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] font-mono tracking-wider text-zinc-400">SCROLL DOWN</span>
          <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
