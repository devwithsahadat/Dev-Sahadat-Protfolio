import { Mail, Phone, MapPin, GraduationCap, Briefcase, Download, User } from "lucide-react";
import { AboutData } from "../types";

interface AboutSectionProps {
  about: AboutData;
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-white dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
            Get To Know Me
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <div className="mt-4 h-1.5 w-16 bg-purple-600 rounded-full mx-auto" />
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Avatar with ambient styling */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Outer double glowing frames */}
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-purple-600 to-blue-500 opacity-25 group-hover:opacity-60 blur-lg transition duration-500" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-600 opacity-10 group-hover:opacity-20 transition duration-500" />
              
              <div className="relative bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <img
                  src={about.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400"}
                  alt={about.name || "Md. Nijam Hossen"}
                  className="w-full h-auto aspect-square object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Float Card Badge */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-bold">Experience</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">3+ Years Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Biography & Fast Facts */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white mb-4">
              I am a passionate <span className="text-purple-600 dark:text-purple-400">{about.role || "Full-Stack Developer"}</span>
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base mb-8 whitespace-pre-wrap">
              {about.bio || "Bio content not configured yet."}
            </p>

            {/* Fact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {about.email && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900/50">
                  <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400 uppercase font-mono font-semibold">Email Me</p>
                    <a href={`mailto:${about.email}`} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-purple-500 truncate block">
                      {about.email}
                    </a>
                  </div>
                </div>
              )}
              {about.phone && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900/50">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400 uppercase font-mono font-semibold">Call Me</p>
                    <a href={`tel:${about.phone}`} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-500 truncate block">
                      {about.phone}
                    </a>
                  </div>
                </div>
              )}
              {about.location && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900/50">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400 uppercase font-mono font-semibold">Location</p>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                      {about.location}
                    </span>
                  </div>
                </div>
              )}
              {about.education && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900/50">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400 uppercase font-mono font-semibold">Education</p>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                      {about.education}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Call To Action */}
            {about.resumeUrl && (
              <div className="flex items-center">
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-98 shadow-md hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10"
                >
                  <Download className="w-4 h-4 animate-pulse" />
                  <span>Download My CV / Resume</span>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
