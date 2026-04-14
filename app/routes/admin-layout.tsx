import { Outlet, useLocation, Navigate } from "react-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import LoginPage from "./admin/login";
import { LogOut } from "lucide-react";
import type { UserRole } from "@/lib/types";

/** Route prefix → which roles may access it. Omitted = all roles. */
const routeRoles: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/admin/events", roles: ["admin"] },
  { prefix: "/admin/legends", roles: ["admin", "writer"] },
  { prefix: "/admin/races", roles: ["admin"] },
  { prefix: "/admin/participants", roles: ["admin", "staff"] },
  { prefix: "/admin/galleries", roles: ["admin"] },
  { prefix: "/admin/config", roles: ["admin"] },
];

const AuthGate = () => {
  const { user, loading, role, signOut } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-700 bg-neutral-800 p-8 shadow-xl text-center">
          <h1 className="text-xl font-bold font-display text-primary-light">
            Nemáte oprávnění
          </h1>
          <p className="text-sm text-gray-400">
            Váš účet nemá přiřazenou roli pro přístup do administrace.
          </p>
          <button
            onClick={signOut}
            className="flex w-full items-center justify-center gap-2 rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
          </button>
        </div>
      </div>
    );
  }

  const rule = routeRoles.find((r) => pathname.startsWith(r.prefix));
  if (rule && (!role || !rule.roles.includes(role))) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
};

const AdminLayout = () => {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
};

export default AdminLayout;
