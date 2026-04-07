"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import LoginPage from "./login";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <AdminShell>{children}</AdminShell>;
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
};

export default AdminLayout;
