import { Outlet } from "react-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import LoginPage from "./admin/login";

const AuthGate = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

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
