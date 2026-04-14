import { useState } from "react";
import { doc, orderBy, query, setDoc, type DocumentReference } from "firebase/firestore";
import { useDocumentData, useCollectionData } from "@/lib/firestore-hooks";
import { db, typedCollection } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, UserPlus, Info } from "lucide-react";
import type { Config, Event, AdminConfig, UserRole } from "@/lib/types";

const roleBadgeColors: Record<UserRole, string> = {
  admin: "bg-red-900/40 text-red-400",
  writer: "bg-blue-900/40 text-blue-400",
  staff: "bg-green-900/40 text-green-400",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  writer: "Písař",
  staff: "Štáb",
};

const ConfigPage = () => {
  const [config, loading] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>,
  );
  const [events] = useCollectionData(
    query(typedCollection<Event>("events"), orderBy("year", "desc")),
  );

  const handleEventChange = async (eventId: string) => {
    try {
      await setDoc(doc(db, "config", "config"), { event: eventId });
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;

  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-lg border border-gray-700 bg-neutral-800 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Aktivní událost</label>
          <select
            value={config?.event ?? ""}
            onChange={(e) => handleEventChange(e.target.value)}
            className="w-full rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="" disabled>Vyberte událost</option>
            {(events ?? []).map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.name} ({ev.year})</option>
            ))}
          </select>
        </div>
      </div>

      <UserManagement />
    </div>
  );
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [adminsConfig] = useDocumentData<AdminConfig>(
    doc(db, "config", "admins") as DocumentReference<AdminConfig>,
  );
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("writer");
  const [saving, setSaving] = useState(false);

  const users = adminsConfig?.users ?? [];
  const adminCount = users.filter((u) => u.role === "admin").length;
  const currentEmail = currentUser?.email?.toLowerCase() ?? "";

  const saveUsers = async (updated: AdminConfig["users"]) => {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", "admins"), { users: updated });
    } catch (err) {
      alert("Chyba při ukládání uživatelů");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const name = newEmail.trim().toLowerCase();
    if (!name) return;
    const email = name.includes("@") ? name : `${name}@malenovska.cz`;
    if (users.some((u) => u.email.toLowerCase() === email)) {
      alert("Tento uživatel již existuje.");
      return;
    }
    await saveUsers([...users, { email, role: newRole }]);
    setNewEmail("");
    setNewRole("writer");
  };

  const handleRoleChange = async (email: string, newRole: UserRole) => {
    const updated = users.map((u) => u.email === email ? { ...u, role: newRole } : u);
    await saveUsers(updated);
  };

  const handleRemove = async (email: string) => {
    const user = users.find((u) => u.email === email);
    if (user?.role === "admin" && adminCount <= 1) {
      alert("Nelze odebrat posledního administrátora.");
      return;
    }
    await saveUsers(users.filter((u) => u.email !== email));
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-neutral-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary-light">Správa uživatelů</h2>

      {users.length > 0 && (
        <ul className="space-y-2">
          {users.map((u) => {
            const isSelf = u.email.toLowerCase() === currentEmail;
            const isLastAdmin = u.role === "admin" && adminCount <= 1;
            return (
              <li key={u.email} className="flex items-center justify-between rounded border border-gray-700 px-3 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-primary-light truncate">{u.email}</span>
                  {isSelf ? (
                    <span className={`rounded px-2 py-0.5 text-xs font-medium shrink-0 ${roleBadgeColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.email, e.target.value as UserRole)}
                      disabled={saving}
                      className={`rounded px-2 py-0.5 text-xs font-medium shrink-0 border-none cursor-pointer focus:ring-1 focus:ring-secondary focus:outline-none ${roleBadgeColors[u.role]}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="writer">Písař</option>
                      <option value="staff">Štáb</option>
                    </select>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(u.email)}
                  disabled={saving || isSelf || isLastAdmin}
                  className="rounded p-1 text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                  title={isSelf ? "Nelze odebrat sebe" : "Odebrat uživatele"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleAdd} className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <div className="flex rounded border border-gray-600 bg-neutral-900 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
              <input
                type="text"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="uživatel"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-primary-light outline-none"
              />
              <span className="flex items-center pr-3 text-sm text-gray-500 select-none">@malenovska.cz</span>
            </div>
          </div>
          <div className="shrink-0">
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="rounded border border-gray-600 bg-neutral-900 px-3 py-2 text-sm text-primary-light focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="admin">Admin</option>
              <option value="writer">Písař</option>
              <option value="staff">Štáb</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary-dark disabled:opacity-50 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Přidat
        </button>
      </form>

      <div className="flex items-start gap-2 rounded bg-blue-900/20 px-3 py-2 text-xs text-blue-400">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Změny se projeví po opětovném přihlášení uživatele.
      </div>
    </div>
  );
};

export default ConfigPage;
