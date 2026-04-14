import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEmulators } from "@/lib/firebase";
import { LogIn, Shield, ScrollText, Users } from "lucide-react";
import type { UserRole } from "@/lib/types";

const testAccounts: Array<{ email: string; role: UserRole; label: string; icon: typeof Shield }> = [
  { email: "admin@malenovska.cz", role: "admin", label: "Admin", icon: Shield },
  { email: "writer@malenovska.cz", role: "writer", label: "Písař", icon: ScrollText },
  { email: "staff@malenovska.cz", role: "staff", label: "Štáb", icon: Users },
];

const LoginPage = () => {
  const { signIn, signInAs } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn();
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_AUTHORIZED") {
        setError("Nemáte oprávnění pro přístup do administrace.");
      } else {
        setError("Přihlášení se nezdařilo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async (email: string) => {
    setError("");
    setLoading(true);
    try {
      await signInAs(email, "test1234");
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_AUTHORIZED") {
        setError("Nemáte oprávnění pro přístup do administrace.");
      } else {
        setError("Přihlášení se nezdařilo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-700 bg-neutral-800 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold font-display text-primary-light">
          Malenovská administrace
        </h1>

        {error && (
          <div className="rounded bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {useEmulators ? (
          <div className="space-y-2">
            <p className="text-center text-xs text-gray-500 mb-3">
              Přihlásit se jako:
            </p>
            {testAccounts.map(({ email, role, label, icon: Icon }) => (
              <button
                key={role}
                onClick={() => handleTestSignIn(email)}
                disabled={loading}
                className="flex w-full items-center gap-3 rounded border border-gray-600 px-4 py-2.5 text-sm text-primary-light hover:border-secondary hover:text-secondary disabled:opacity-50 transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{label}</span>
                <span className="ml-auto text-xs text-gray-500">{email}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded bg-secondary px-4 py-2 text-white font-medium hover:bg-secondary-dark disabled:opacity-50 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Přihlašování…" : "Přihlásit se přes Google"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Pouze pro uživatele @malenovska.cz
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
