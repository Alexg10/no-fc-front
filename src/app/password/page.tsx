"use client";

import { FormEvent, useState } from "react";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Mot de passe incorrect");
        setPassword("");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-10 w-full max-w-md">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="heading-xl-obviously text-white">NOFC</h1>
          <p className="heading-s-obviously text-white/60">Coming Soon</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-transparent border border-white/30 text-white px-4 py-3 text-l-polymath placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-polymath text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-white text-black py-3 text-xl-obviously uppercase tracking-wide hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
