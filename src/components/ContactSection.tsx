import { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { AboutData } from "../types";

interface ContactSectionProps {
  about: AboutData;
}

export default function ContactSection({ about }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Freelance Project Consultation",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("error");
      setFeedbackMsg("All fields are required. Please check your submission.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setStatus("success");
        setFeedbackMsg(result.message || "Thank you! Your message was sent successfully.");
        setFormData({ name: "", email: "", subject: "Freelance Project Consultation", message: "" });
      } else {
        setStatus("error");
        setFeedbackMsg(result.error || "Failed to deliver inquiry. Please try again later.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setFeedbackMsg("Network error occurred. Please verify your connection and try again.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
            Get In Touch
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
            Hire Me / Contact
          </h2>
          <div className="mt-4 h-1.5 w-16 bg-purple-600 rounded-full mx-auto" />
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Panel: Context Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-6 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Let's Build Something Great</span>
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                I am open to freelance projects, contract roles, and full-time remote opportunities. Feel free to reach out with project parameters, timelines, and budgets—I will reply within 24 hours.
              </p>

              {/* Direct Coordinate Cards */}
              <div className="space-y-4">
                {about.email && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 font-semibold font-mono uppercase">Email</p>
                      <a href={`mailto:${about.email}`} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-purple-500 truncate block">
                        {about.email}
                      </a>
                    </div>
                  </div>
                )}

                {about.phone && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 font-semibold font-mono uppercase">Phone / WhatsApp</p>
                      <a href={`tel:${about.phone}`} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-blue-500 truncate block">
                        {about.phone}
                      </a>
                    </div>
                  </div>
                )}

                {about.location && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 font-semibold font-mono uppercase">Current Location</p>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block">
                        {about.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Status Card */}
            <div className="bg-purple-600/5 dark:bg-purple-500/5 p-6 rounded-2xl border border-purple-500/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono block mb-1">
                Current Availability
              </span>
              <p className="text-sm font-bold text-zinc-800 dark:text-white">
                Accepting projects starting this month!
              </p>
            </div>
          </div>

          {/* Right Panel: Functional Form */}
          <div className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Form Status Banner */}
              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start space-x-2.5">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{feedbackMsg}</span>
                </div>
              )}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="form-name" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono uppercase block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="form-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:border-purple-500 text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="form-email" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono uppercase block">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:border-purple-500 text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Row 2: Subject Dropdown Selection */}
              <div className="space-y-2">
                <label htmlFor="form-subject" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono uppercase block">
                  Subject / Topic
                </label>
                <select
                  id="form-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:border-purple-500 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="Freelance Project Consultation">Freelance Project Consultation</option>
                  <option value="Full-Time Remote Position">Full-Time Remote Position</option>
                  <option value="Consulting & Architecture Request">Consulting & Architecture Request</option>
                  <option value="General Inquiry / Hello World">General Inquiry / Hello World</option>
                </select>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="space-y-2">
                <label htmlFor="form-message" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono uppercase block">
                  Your Message Description
                </label>
                <textarea
                  id="form-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your project requirements, budget scale, and schedule milestones..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:border-purple-500 text-zinc-800 dark:text-zinc-200 resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-98 shadow-md hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Delivering Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
