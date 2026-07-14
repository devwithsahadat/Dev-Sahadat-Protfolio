import * as LucideIcons from "lucide-react";
import { SkillData } from "../types";

interface SkillsSectionProps {
  skills: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const categories = ["Frontend", "Backend", "Tools & Others"];

  // Helper to render Lucide Icons by name dynamically
  const renderIcon = (iconName: string) => {
    // Fallback if icon name doesn't exist
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return <IconComponent className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
  };

  return (
    <section id="skills" className="py-24 bg-zinc-50 dark:bg-zinc-900/40 transition-colors duration-300 border-y border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
            My Tech Stack
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
            Technical Expertise
          </h2>
          <div className="mt-4 h-1.5 w-16 bg-purple-600 rounded-full mx-auto" />
        </div>

        {/* Skills Grid divided by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const filteredSkills = skills.filter(
              (skill) => skill.category.toLowerCase() === category.toLowerCase()
            );

            return (
              <div
                key={category}
                className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-md flex flex-col hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 transform"
              >
                {/* Category Header */}
                <h3 className="font-display font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-xs font-mono font-normal text-zinc-400 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900">
                    {filteredSkills.length} Skills
                  </span>
                </h3>

                {/* Skills Progress list */}
                <div className="space-y-6 flex-1">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        {/* Title & Icon & Value */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-purple-950/20 shrink-0">
                              {renderIcon(skill.icon)}
                            </div>
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                            {skill.progress}%
                          </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          {/* Animated inner bar */}
                          <div
                            className="h-full rounded-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-32 flex items-center justify-center text-zinc-400 text-sm italic">
                      No skills added in this category.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
