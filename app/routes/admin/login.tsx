import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Neplatné přihlašovací údaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-700 bg-neutral-800 p-8 shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold font-display text-primary-light">
          Malenovská administrace
        </h1>

        {error && (
          <div className="rounded bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Heslo
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-secondary px-4 py-2 text-white font-medium hover:bg-secondary-dark disabled:opacity-50 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          {loading ? "Přihlašování" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
