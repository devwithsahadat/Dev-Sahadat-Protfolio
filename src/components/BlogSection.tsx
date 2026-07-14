import { useState } from "react";
import { Calendar, Clock, ArrowRight, X, Search, User, Share2 } from "lucide-react";
import { BlogPost } from "../types";

interface BlogSectionProps {
  blogs: BlogPost[];
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Get all unique tags from blogs
  const allTags = ["All"];
  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  // Filter blogs by search queries and tag selection
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === "All" || blog.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // A helper function to parse markdown block items and render them as JSX elements
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const blocks = text.split("\n\n");

    return blocks.map((block, idx) => {
      const trimmedBlock = block.trim();

      // Heading 3: ### Title
      if (trimmedBlock.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display font-bold text-xl text-zinc-900 dark:text-white mt-6 mb-3">
            {trimmedBlock.replace("### ", "")}
          </h4>
        );
      }

      // Heading 2: ## Title
      if (trimmedBlock.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-display font-bold text-2xl text-zinc-900 dark:text-white mt-8 mb-4">
            {trimmedBlock.replace("## ", "")}
          </h3>
        );
      }

      // Code blocks: ```language ... ```
      if (trimmedBlock.startsWith("```")) {
        const lines = trimmedBlock.split("\n");
        const code = lines.slice(1, -1).join("\n");
        return (
          <pre
            key={idx}
            className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 font-mono text-xs sm:text-sm text-purple-600 dark:text-purple-300 overflow-x-auto my-5 border border-zinc-200 dark:border-zinc-800"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Bullet Lists: - Item
      if (trimmedBlock.startsWith("- ") || trimmedBlock.startsWith("* ")) {
        const items = trimmedBlock.split("\n").map((item) => item.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-300 text-sm sm:text-base my-4 ml-3">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base my-4 whitespace-pre-line">
          {trimmedBlock}
        </p>
      );
    });
  };

  return (
    <section id="blogs" className="py-24 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
            Read My Articles
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
            Latest Blog Posts
          </h2>
          <div className="mt-4 h-1.5 w-16 bg-purple-600 rounded-full mx-auto" />
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 max-w-5xl mx-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-sm focus:outline-hidden focus:border-purple-500 text-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* Tags Filter */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 ${
                    selectedTag === tag
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                      : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-purple-600 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850 dark:hover:bg-zinc-900"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blogs grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group cursor-pointer bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl overflow-hidden hover:shadow-2xl dark:hover:shadow-purple-500/5 hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 flex flex-col h-full"
              >
                {/* Blog Image */}
                <div className="relative aspect-video overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={blog.image || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Pill Overlays */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Date & Read time */}
                  <div className="flex items-center space-x-4 text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 mb-3.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white group-hover:text-purple-500 transition-colors line-clamp-2 mb-3">
                    {blog.title}
                  </h3>

                  {/* Short Excerpt */}
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {blog.content.replace(/[#*`\-]/g, "")}
                  </p>

                  {/* CTA link arrow */}
                  <div className="flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-auto">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl">
              <span className="text-zinc-400 text-sm">No articles match your filters.</span>
            </div>
          )}
        </div>

        {/* Detailed Blog Reading Overlay Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white dark:bg-zinc-950 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-900 animate-in fade-in duration-200 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5 text-xs text-zinc-400 font-mono">
                  <User className="w-3.5 h-3.5" />
                  <span>By {selectedBlog.author}</span>
                  <span>•</span>
                  <span>{selectedBlog.date}</span>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
                  aria-label="Close article modal"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal scrollable body */}
              <div className="overflow-y-auto p-6 sm:p-10 flex-grow">
                {/* Image */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-8 border border-zinc-200 dark:border-zinc-850">
                  <img
                    src={selectedBlog.image || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <h3 className="font-display font-bold text-2xl sm:text-4.5xl tracking-tight text-zinc-900 dark:text-white mb-6">
                  {selectedBlog.title}
                </h3>

                {/* Article content rendering */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  {renderMarkdown(selectedBlog.content)}
                </div>

                {/* Keyword display */}
                {selectedBlog.seoKeywords && (
                  <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                    <span className="text-xs font-mono font-medium text-zinc-400">
                      SEO Index tags: {selectedBlog.seoKeywords}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between shrink-0">
                <span className="text-xs text-zinc-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated read: {selectedBlog.readTime}</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Portfolio link copied to clipboard for sharing!");
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
