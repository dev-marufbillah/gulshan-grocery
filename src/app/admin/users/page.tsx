"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Shield, Trash2, Search, CheckCircle2, AlertCircle } from "lucide-react";

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "user";
  createdAt: string;
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // @ts-expect-error session role
  const currentUserRole = session?.user?.role;
  const isSuperAdmin = currentUserRole === "superadmin";

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        showToast(data.error || "Failed to load users", "error");
      }
    } catch {
      showToast("Network error while fetching users", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (isMounted) {
          if (res.ok) {
            setUsers(data.users || []);
          } else {
            setToast({ message: data.error || "Failed to load users", type: "error" });
          }
        }
      } catch {
        if (isMounted) {
          setToast({ message: "Network error while fetching users", type: "error" });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isSuperAdmin) {
      showToast("Only Super Admin can change user roles!", "error");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");
        fetchUsers();
      } else {
        showToast(data.error || "Failed to update role", "error");
      }
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!isSuperAdmin) {
      showToast("Only Super Admin can delete users!", "error");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");
        fetchUsers();
      } else {
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 text-white shadow-2xl transition-all ${
            toast.type === "success" ? "bg-[#1E7F57]" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={22} className="text-[#FBC617]" />
          ) : (
            <AlertCircle size={22} />
          )}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Customer &amp; Staff Management</h1>
          <p className="text-sm text-[#6b6b6b]">
            Manage registered users, promote employees to admins, or delete accounts.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E7F57]">
          <Shield size={16} />
          <span>Logged as: {currentUserRole?.toUpperCase()}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
        {/* Search Bar */}
        <div className="border-b border-[#e5e5e5] p-4">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#F9F9F9] px-4 py-2 transition focus-within:border-[#1E7F57] focus-within:bg-white">
            <Search size={18} className="text-[#6b6b6b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-transparent text-sm outline-none text-[#1a1a1a]"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1a1a1a]">
            <thead className="bg-[#F9F9F9] text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1E7F57] border-t-transparent"></div>
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPermanentSuperAdmin = u.email === "marufsalauddinofficial@gmail.com";

                  return (
                    <tr key={u._id} className="transition hover:bg-[#F9F9F9]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3EE] font-bold text-[#1E7F57]">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1a1a1a]">{u.name}</p>
                            {isPermanentSuperAdmin && (
                              <span className="text-[10px] font-bold text-[#1E7F57]">★ Primary Super Admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#6b6b6b]">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-[#6b6b6b]">{u.createdAt}</td>
                      <td className="px-6 py-4">
                        {isPermanentSuperAdmin ? (
                          <span className="rounded-full bg-[#FBC617] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                            Super Admin
                          </span>
                        ) : (
                          <select
                            disabled={!isSuperAdmin}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="cursor-pointer rounded-full border border-[#e5e5e5] bg-white px-3 py-1 text-xs font-bold text-[#1a1a1a] outline-none transition focus:border-[#1E7F57] disabled:cursor-not-allowed disabled:bg-[#f4f4f4]"
                          >
                            <option value="user">Customer (User)</option>
                            <option value="admin">Admin / Staff</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isPermanentSuperAdmin && (
                          <button
                            disabled={!isSuperAdmin}
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            className="text-red-500 transition hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}