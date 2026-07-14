import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  MessageSquare,
  User,
  Code,
  Briefcase,
  BookOpen,
  Link,
  KeyRound,
  Plus,
  Trash2,
  Check,
  CheckCircle,
  AlertCircle,
  Eye,
  LogOut,
  Save,
  Lock,
  ArrowLeft,
  X,
  FileText
} from "lucide-react";
import { AboutData, SkillData, ProjectData, BlogPost, SocialLinks, ContactInquiry } from "../types";

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onRefreshData: () => void;
  portfolioData: {
    about: AboutData;
    skills: SkillData[];
    projects: ProjectData[];
    blogs: BlogPost[];
    socialLinks: SocialLinks;
    inquiries?: ContactInquiry[];
  };
}

export default function AdminDashboard({
  token,
  onLogout,
  onRefreshData,
  portfolioData
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "about" | "skills" | "projects" | "blogs" | "socials" | "security">("inquiries");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Inquiries State (fetched via admin endpoint)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Local Editable States
  const [aboutForm, setAboutForm] = useState<AboutData>({ ...portfolioData.about });
  const [skillsList, setSkillsList] = useState<SkillData[]>([...portfolioData.skills]);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([...portfolioData.projects]);
  const [blogsList, setBlogsList] = useState<BlogPost[]>([...portfolioData.blogs]);
  const [socialsForm, setSocialsForm] = useState<SocialLinks>({ ...portfolioData.socialLinks });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPassword: "", confirm: "" });

  // Sync state if portfolioData updates
  useEffect(() => {
    setAboutForm({ ...portfolioData.about });
    setSkillsList([...portfolioData.skills]);
    setProjectsList([...portfolioData.projects]);
    setBlogsList([...portfolioData.blogs]);
    setSocialsForm({ ...portfolioData.socialLinks });
  }, [portfolioData]);

  // Fetch full Admin data (specifically for Inquiries)
  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/data", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries) {
          setInquiries(data.inquiries);
        }
      }
    } catch (e) {
      console.error("Error fetching admin data:", e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, portfolioData]);

  const triggerFeedback = (type: "success" | "error", msg: string) => {
    setStatus(type);
    setFeedbackMsg(msg);
    setTimeout(() => {
      setStatus("idle");
    }, 4000);
  };

  // --- API Save Actions ---

  // 1. Save About Me
  const handleSaveAbout = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(aboutForm)
      });
      if (res.ok) {
        triggerFeedback("success", "About Me biography and details updated successfully!");
        onRefreshData();
      } else {
        const errorData = await res.json();
        triggerFeedback("error", errorData.error || "Failed to update About Section.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 2. Save Social Links
  const handleSaveSocials = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-socials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ socialLinks: socialsForm })
      });
      if (res.ok) {
        triggerFeedback("success", "Social media handles updated successfully!");
        onRefreshData();
      } else {
        triggerFeedback("error", "Failed to update social profiles.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 3. Save Skills List
  const handleSaveSkills = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ skills: skillsList })
      });
      if (res.ok) {
        triggerFeedback("success", "Skills list updated and saved to JSON database!");
        onRefreshData();
      } else {
        triggerFeedback("error", "Failed to update skills list.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 4. Save Projects List
  const handleSaveProjects = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ projects: projectsList })
      });
      if (res.ok) {
        triggerFeedback("success", "Project portfolio updated successfully!");
        onRefreshData();
      } else {
        triggerFeedback("error", "Failed to update projects list.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 5. Save Blogs List
  const handleSaveBlogs = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ blogs: blogsList })
      });
      if (res.ok) {
        triggerFeedback("success", "Blog articles updated successfully!");
        onRefreshData();
      } else {
        triggerFeedback("error", "Failed to update blog index.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 6. Delete Contact Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;
    try {
      const res = await fetch("/api/admin/delete-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setInquiries(inquiries.filter((inq) => inq.id !== id));
        triggerFeedback("success", "Message deleted successfully!");
        onRefreshData();
      } else {
        triggerFeedback("error", "Failed to delete inquiry.");
      }
    } catch (e) {
      triggerFeedback("error", "Network connection failed.");
    }
  };

  // 7. Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/update-inquiry-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInquiries(
          inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
        triggerFeedback("success", `Inquiry status changed to: ${newStatus}`);
        onRefreshData();
      }
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  // 8. Update Password
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      triggerFeedback("error", "New Passwords do not match!");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: passwordForm.newPassword })
      });
      if (res.ok) {
        triggerFeedback("success", "Admin password changed successfully!");
        setPasswordForm({ current: "", newPassword: "", confirm: "" });
      } else {
        const err = await res.json();
        triggerFeedback("error", err.error || "Failed to update password.");
      }
    } catch (e) {
      triggerFeedback("error", "Network error updating password.");
    }
  };

  // --- Inline List Handlers ---

  // Skills
  const handleAddSkill = () => {
    const newSkill: SkillData = {
      id: `skill-${Date.now()}`,
      category: "Frontend",
      name: "New Custom Skill",
      progress: 80,
      icon: "Code"
    };
    setSkillsList([...skillsList, newSkill]);
  };

  const handleUpdateSkillField = (id: string, field: keyof SkillData, value: any) => {
    setSkillsList(
      skillsList.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
    );
  };

  const handleDeleteSkill = (id: string) => {
    setSkillsList(skillsList.filter((s) => s.id !== id));
  };

  // Projects
  const handleAddProject = () => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      title: "New Featured Project",
      description: "A summary of my new project, explaining its scope, technical challenges, and core outcomes.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      githubLink: "#",
      liveLink: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    };
    setProjectsList([...projectsList, newProj]);
  };

  const handleUpdateProjectField = (id: string, field: keyof ProjectData, value: any) => {
    setProjectsList(
      projectsList.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjectsList(projectsList.filter((p) => p.id !== id));
  };

  // Blogs
  const handleAddBlog = () => {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: "How I Solved Complex Scaling Challenges",
      content: "Write article body in standard markdown format here...\n\n### Core challenges\nWe discovered bottlenecks...",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "4 min read",
      author: aboutForm.name || "Md. Nijam Hossen",
      tags: ["Development", "Coding"],
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
      seoKeywords: "scaling, database optimization, cloud run, performance metrics"
    };
    setBlogsList([...blogsList, newBlog]);
  };

  const handleUpdateBlogField = (id: string, field: keyof BlogPost, value: any) => {
    setBlogsList(
      blogsList.map((blog) => (blog.id === id ? { ...blog, [field]: value } : blog))
    );
  };

  const handleDeleteBlog = (id: string) => {
    setBlogsList(blogsList.filter((b) => b.id !== id));
  };

  // Sidebar Tabs Config
  const sidebarTabs = [
    { id: "inquiries", label: "Hire Inquiries", icon: MessageSquare, badge: inquiries.filter((i) => i.status === "unread").length },
    { id: "about", label: "About Me Details", icon: User },
    { id: "skills", label: "Tech Stack Skills", icon: Code },
    { id: "projects", label: "Featured Projects", icon: Briefcase },
    { id: "blogs", label: "Blog Section CMS", icon: BookOpen },
    { id: "socials", label: "Social Media / Resume", icon: Link },
    { id: "security", label: "Access Settings", icon: KeyRound }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white flex items-center space-x-2">
              <span>Admin CMS Dashboard</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                JSON File DB Mode
              </span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Directly edit and synchronize files stored in <code className="text-purple-600 dark:text-purple-400">portfolio-db.json</code>.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 px-4 py-2 border border-rose-200 dark:border-rose-900/40 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/15 dark:hover:bg-rose-950/35 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {status === "success" && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center space-x-2.5 animate-in fade-in duration-200">
            <CheckCircle className="w-5 h-5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center space-x-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
        {status === "saving" && (
          <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm flex items-center space-x-2.5 animate-pulse">
            <span className="h-4 w-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mr-2" />
            <span>Updating database records... Please wait.</span>
          </div>
        )}

        {/* Layout split: Left Sidebar Navigation, Right Workspace Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 space-y-1.5 shadow-sm">
              <p className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase px-3 mb-3">Management Sections</p>
              {sidebarTabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setStatus("idle");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                        : "text-zinc-600 hover:text-purple-500 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-purple-400 dark:hover:bg-zinc-950"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <TabIcon className="w-4.5 h-4.5" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right workspace details */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm">
              
              {/* --- TABS IMPLEMENTATIONS --- */}

              {/* 1. HIRE INQUIRIES */}
              {activeTab === "inquiries" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Contact & Hiring Inquiries</h3>
                    <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-2.5 py-1 rounded-full">
                      {inquiries.length} Messages total
                    </span>
                  </div>

                  <div className="space-y-4">
                    {inquiries.length > 0 ? (
                      inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className={`p-5 rounded-xl border transition-all ${
                            inq.status === "unread"
                              ? "border-purple-500/40 bg-purple-500/5 dark:bg-purple-500/2"
                              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"
                          }`}
                        >
                          {/* Header details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-zinc-900 dark:text-white text-sm sm:text-base">
                                  {inq.name}
                                </span>
                                {inq.status === "unread" && (
                                  <span className="text-[9px] font-mono uppercase bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">
                                    New
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-400 font-mono block">
                                {inq.email} • {new Date(inq.date).toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Fast Actions */}
                            <div className="flex items-center space-x-1.5 self-start sm:self-center">
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                className="text-xs px-2 py-1 rounded-md border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                              >
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                              </select>
                              
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-950/25 transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-lg p-3">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1 font-mono">
                              Subject: {inq.subject}
                            </p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                              {inq.message}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <MessageSquare className="w-8 h-8 text-zinc-300 mb-2" />
                        <span className="text-zinc-400 text-sm">No incoming inquiries found in database.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ABOUT ME DETAILS */}
              {activeTab === "about" && (
                <form onSubmit={handleSaveAbout} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Edit About Me Profile</h3>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Full Name</label>
                      <input
                        type="text"
                        value={aboutForm.name}
                        onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Professional Role / Title</label>
                      <input
                        type="text"
                        value={aboutForm.role}
                        onChange={(e) => setAboutForm({ ...aboutForm, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Avatar Image URL</label>
                      <input
                        type="text"
                        value={aboutForm.avatar}
                        onChange={(e) => setAboutForm({ ...aboutForm, avatar: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Detailed Biography (Bio)</label>
                      <textarea
                        rows={5}
                        value={aboutForm.bio}
                        onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Primary Email</label>
                      <input
                        type="email"
                        value={aboutForm.email}
                        onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Phone Number</label>
                      <input
                        type="text"
                        value={aboutForm.phone}
                        onChange={(e) => setAboutForm({ ...aboutForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Location State</label>
                      <input
                        type="text"
                        value={aboutForm.location}
                        onChange={(e) => setAboutForm({ ...aboutForm, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Highest Education Degree</label>
                      <input
                        type="text"
                        value={aboutForm.education}
                        onChange={(e) => setAboutForm({ ...aboutForm, education: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Total Years Experience</label>
                      <input
                        type="text"
                        value={aboutForm.experience}
                        onChange={(e) => setAboutForm({ ...aboutForm, experience: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Resume / CV Anchor URL</label>
                      <input
                        type="text"
                        value={aboutForm.resumeUrl}
                        onChange={(e) => setAboutForm({ ...aboutForm, resumeUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                      />
                    </div>

                    {/* Dynamic Logo Configuration */}
                    <div className="sm:col-span-2 border-t border-zinc-150 dark:border-zinc-900 pt-5 mt-3 space-y-4">
                      <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">Dynamic Logo Configuration</h4>
                      <p className="text-xs text-zinc-400">Choose between showing your name as a stylized text logo, or uploading/providing an image URL to represent your brand.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono block">Logo Type Mode</label>
                          <select
                            value={aboutForm.logoType || "text"}
                            onChange={(e) => setAboutForm({ ...aboutForm, logoType: e.target.value as "text" | "image" })}
                            className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                          >
                            <option value="text">Styled Text Logo</option>
                            <option value="image">Uploaded Image Logo</option>
                          </select>
                        </div>

                        {aboutForm.logoType === "image" ? (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Logo Image URL</label>
                            <input
                              type="text"
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              value={aboutForm.logoImage || ""}
                              onChange={(e) => setAboutForm({ ...aboutForm, logoImage: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Logo Branding Text</label>
                            <input
                              type="text"
                              placeholder="e.g. Sahadat Hossain"
                              value={aboutForm.logoText || ""}
                              onChange={(e) => setAboutForm({ ...aboutForm, logoText: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* 3. TECHNICAL SKILLS LIST */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Manage Technical Skills</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Categorize skill list items to render animated progress meters.</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddSkill}
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Skill</span>
                      </button>
                      <button
                        onClick={handleSaveSkills}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Skills List</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {skillsList.map((skill, index) => (
                      <div
                        key={skill.id}
                        className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/85 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col md:flex-row md:items-center gap-4 relative"
                      >
                        <span className="absolute -top-2.5 -left-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-mono h-5 w-5 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-grow">
                          {/* Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleUpdateSkillField(skill.id, "name", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200"
                            />
                          </div>
                          {/* Category */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Category Group</label>
                            <select
                              value={skill.category}
                              onChange={(e) => handleUpdateSkillField(skill.id, "category", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200"
                            >
                              <option value="Frontend">Frontend</option>
                              <option value="Backend">Backend</option>
                              <option value="Tools & Others">Tools & Others</option>
                            </select>
                          </div>
                          {/* Progress */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Progress: {skill.progress}%</label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={skill.progress}
                              onChange={(e) => handleUpdateSkillField(skill.id, "progress", parseInt(e.target.value))}
                              className="w-full accent-purple-500 mt-2"
                            />
                          </div>
                          {/* Icon Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Lucide Icon ID</label>
                            <select
                              value={skill.icon}
                              onChange={(e) => handleUpdateSkillField(skill.id, "icon", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                            >
                              <option value="Code">Code</option>
                              <option value="Server">Server</option>
                              <option value="Database">Database</option>
                              <option value="Layers">Layers</option>
                              <option value="Palette">Palette</option>
                              <option value="Cpu">Cpu</option>
                              <option value="GitBranch">GitBranch</option>
                              <option value="Cloud">Cloud</option>
                              <option value="Key">Key</option>
                              <option value="Settings">Settings</option>
                              <option value="Terminal">Terminal</option>
                            </select>
                          </div>
                        </div>

                        {/* Delete Skill Action */}
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 border border-zinc-200 dark:border-zinc-850 rounded-lg hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:hover:bg-rose-950/20 text-zinc-400 cursor-pointer self-end md:self-center shrink-0"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {skillsList.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-850 rounded-xl">
                        <span className="text-zinc-400 text-sm">Skills list is empty. Click Add Skill.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. FEATURED PROJECTS LIST */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Configure Featured Projects</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Control image paths, tech specs, live web previews, and code links.</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddProject}
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Project</span>
                      </button>
                      <button
                        onClick={handleSaveProjects}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Projects List</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {projectsList.map((project, index) => (
                      <div
                        key={project.id}
                        className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 space-y-4 relative"
                      >
                        {/* Header ID */}
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-850">
                          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                            Project #{index + 1}
                          </span>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Project</span>
                          </button>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Project Title</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => handleUpdateProjectField(project.id, "title", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Technologies (Comma Separated)</label>
                            <input
                              type="text"
                              value={project.technologies.join(", ")}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  project.id,
                                  "technologies",
                                  e.target.value.split(",").map((s) => s.trim())
                                )
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                              placeholder="React, Express, MongoDB"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Image Asset Link / Unsplash URL</label>
                            <input
                              type="text"
                              value={project.image}
                              onChange={(e) => handleUpdateProjectField(project.id, "image", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">GitHub Repository URL</label>
                            <input
                              type="text"
                              value={project.githubLink}
                              onChange={(e) => handleUpdateProjectField(project.id, "githubLink", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Live Demo Website Anchor</label>
                            <input
                              type="text"
                              value={project.liveLink}
                              onChange={(e) => handleUpdateProjectField(project.id, "liveLink", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Project Scope Biography</label>
                            <textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => handleUpdateProjectField(project.id, "description", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {projectsList.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <span className="text-zinc-400 text-sm">Portfolio list is empty. Click Add Project.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. BLOG ARTICLES CMS */}
              {activeTab === "blogs" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Blog CMS and Articles</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Publish articles, write markdown tutorials, and configure keywords for SEO.</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddBlog}
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Article</span>
                      </button>
                      <button
                        onClick={handleSaveBlogs}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Blog Index</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {blogsList.map((blog, index) => (
                      <div
                        key={blog.id}
                        className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-850">
                          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                            Blog Post #{index + 1}
                          </span>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Article</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Article Title</label>
                            <input
                              type="text"
                              value={blog.title}
                              onChange={(e) => handleUpdateBlogField(blog.id, "title", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-semibold"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Category Tags (Comma Separated)</label>
                            <input
                              type="text"
                              value={blog.tags.join(", ")}
                              onChange={(e) =>
                                handleUpdateBlogField(
                                  blog.id,
                                  "tags",
                                  e.target.value.split(",").map((s) => s.trim())
                                )
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                              placeholder="React, CSS, Frontend"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Estimated Read Time</label>
                            <input
                              type="text"
                              value={blog.readTime}
                              onChange={(e) => handleUpdateBlogField(blog.id, "readTime", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200"
                              placeholder="5 min read"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Article Cover Image URL</label>
                            <input
                              type="text"
                              value={blog.image}
                              onChange={(e) => handleUpdateBlogField(blog.id, "image", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">SEO Keywords (Comma Separated)</label>
                            <input
                              type="text"
                              value={blog.seoKeywords || ""}
                              onChange={(e) => handleUpdateBlogField(blog.id, "seoKeywords", e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 font-mono"
                              placeholder="React 19, performance, bundling optimization"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold uppercase text-zinc-400 font-mono">Article Markdown Content</label>
                            <textarea
                              rows={10}
                              value={blog.content}
                              onChange={(e) => handleUpdateBlogField(blog.id, "content", e.target.value)}
                              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
                              placeholder="Markdown supported: ## Heading 2, ### Heading 3, - Bullet lists, ```ts Code blocks ```"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {blogsList.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <span className="text-zinc-400 text-sm">Blog list is empty. Click Create Article.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. SOCIAL MEDIA LINKS */}
              {activeTab === "socials" && (
                <form onSubmit={handleSaveSocials} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Social Media Profiles</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Control outward anchors and CV links.</p>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save profiles</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">GitHub Profile Link</label>
                      <input
                        type="url"
                        value={socialsForm.github}
                        onChange={(e) => setSocialsForm({ ...socialsForm, github: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">LinkedIn Profile Link</label>
                      <input
                        type="url"
                        value={socialsForm.linkedin}
                        onChange={(e) => setSocialsForm({ ...socialsForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Facebook Page Link</label>
                      <input
                        type="url"
                        value={socialsForm.facebook}
                        onChange={(e) => setSocialsForm({ ...socialsForm, facebook: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Twitter / X Link</label>
                      <input
                        type="url"
                        value={socialsForm.twitter}
                        onChange={(e) => setSocialsForm({ ...socialsForm, twitter: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">YouTube Channel Link (Optional)</label>
                      <input
                        type="url"
                        value={socialsForm.youtube || ""}
                        onChange={(e) => setSocialsForm({ ...socialsForm, youtube: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://youtube.com/channel"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">External CV Resume URL (Optional)</label>
                      <input
                        type="url"
                        value={socialsForm.externalResume || ""}
                        onChange={(e) => setSocialsForm({ ...socialsForm, externalResume: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200 font-mono"
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* 7. PASSCODE SECURITY */}
              {activeTab === "security" && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Passcode Security</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Control the password required to access this dashboard.</p>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                  </div>

                  <div className="max-w-md space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">New Access Passcode</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                        placeholder="At least 4 characters"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Confirm New Passcode</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-800 dark:text-zinc-200"
                        placeholder="Re-type new passcode"
                        required
                      />
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
