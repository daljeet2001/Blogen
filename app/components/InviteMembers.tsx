"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

export default function InviteMembers({
  tenantId,
  onClose,
}: {
  tenantId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    if (!email) return alert("Enter email");
    setLoading(true);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tenantId, role }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text || "Something went wrong");
        return;
      }

      const data = await res.json();
      alert(`✅ Invite created for ${data.email}`);
      setEmail("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="relative bg-gray-900 text-white rounded-lg p-6 sm:p-8 shadow-lg max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">Invite Members</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-600 bg-black text-white px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Role
          </label>
          <div className="flex space-x-2">
            {["Admin", "Editor", "Viewer"].map((r) => {
              const selected = role === r.toUpperCase();
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r.toUpperCase())}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selected
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span>{r}</span>
               
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="flex items-center text-white text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={sendInvite}
            className="flex items-center text-black bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded-full text-sm"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
