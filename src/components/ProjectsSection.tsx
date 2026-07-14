import { useState } from "react";
import { Github, ExternalLink, Search } from "lucide-react";
import { ProjectData } from "../types";

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedTech, setSelectedTech] = useState("All");

  // Get all unique tech tags from projects to build dynamic filters
  const allTechTags = ["All"];
  projects.forEach((proj) => {
    proj.technologies.forEach((tech) => {
      if (!allTechTags.includes(tech)) {
        allTechTags.push(tech);
      }
    });
  });

  // Filter projects based on choice
  const filteredProjects = selectedTech === "All"
    ? projects
    : projects.filter((proj) => proj.technologies.includes(selectedTech));

  return (
    <section id="projects" className="py-24 bg-white dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
            My Portfolio
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
            Featured Projects
          </h2>
          <div className="mt-4 h-1.5 w-16 bg-purple-600 rounded-full mx-auto" />
        </div>

        {/* Dynamic Technology Filters */}
        {allTechTags.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
            {allTechTags.slice(0, 8).map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
                  selectedTech === tech
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl overflow-hidden hover:shadow-2xl dark:hover:shadow-purple-500/5 hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300"
              >
                {/* Glowing border effects */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none" />

                {/* Project Image Panel */}
                <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-950 shrink-0">
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover Overlay with Links quick actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity duration-350 z-10">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white hover:bg-purple-100 text-zinc-900 rounded-full shadow-md transition-all scale-90 group-hover:scale-100 duration-300"
                        title="GitHub Repository"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white hover:bg-purple-100 text-zinc-900 rounded-full shadow-md transition-all scale-90 group-hover:scale-100 duration-300"
                        title="Live Site Demo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono uppercase tracking-wider font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white group-hover:text-purple-500 transition-colors mb-2.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  {/* Footer Links */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-600 hover:text-purple-500 dark:text-zinc-400 dark:hover:text-purple-400"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 ml-auto"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl">
              <span className="text-zinc-400 text-sm mb-2">No projects match this filter.</span>
              <button
                onClick={() => setSelectedTech("All")}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
