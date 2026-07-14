import { useState, FormEvent } from "react";
import { Lock, X, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      if (response.ok && result.success && result.token) {
        setStatus("success");
        setTimeout(() => {
          onLoginSuccess(result.token);
          setPassword("");
          setStatus("idle");
          onClose();
        }, 1000);
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Incorrect admin passcode.");
      }
    } catch (err) {
      console.error("Login failure:", err);
      setStatus("error");
      setErrorMsg("Connection failure. Check network connectivity.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div
        className="relative bg-white dark:bg-zinc-950 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
          aria-label="Close login dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Graphic Header */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="p-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl mb-4 relative">
            <Lock className="w-8 h-8" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-purple-500 animate-ping" />
          </div>
          <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">Admin Access Lock</h3>
          <p className="text-xs text-zinc-400 max-w-xs mt-1">
            Authentication is required to edit About Bio, Projects, Skills, and Blog database tables.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {status === "error" && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {status === "success" && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Access Approved! Opening Dashboard...</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="admin-passcode" className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
              Enter Admin Passcode
            </label>
            <input
              type="password"
              id="admin-passcode"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-hidden focus:border-purple-500 text-center text-lg tracking-widest text-zinc-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Unlock Control Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono text-zinc-400">
            Hint: Default admin passcode is <code className="text-purple-600 dark:text-purple-400 px-1 py-0.5 bg-purple-500/5 rounded font-bold">admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}
