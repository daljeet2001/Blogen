"use client";
import { useState } from "react";

export default function InviteMembers({ tenantId }: { tenantId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    if (!email) return alert("Enter email");
    setLoading(true);
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, tenantId, role }),
    });
    const data = await res.json();
    alert(`Invite created for ${data.email}`);
    setEmail("");
    setLoading(false);
  };

  return (
    <>
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Invite Members</h2>
      <input type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <select value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="ADMIN">Admin</option>
        <option value="EDITOR">Editor</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <button onClick={sendInvite}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Invite"}
      </button>
    </div>
    </>
  );
}

