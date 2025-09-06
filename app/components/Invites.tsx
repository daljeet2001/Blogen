"use client";
import { useEffect, useState } from "react";

type Invite = {
  id: string;
  email: string;
  role: string;
  token: string;
  tenant: { id: string; name: string };
};

export default function Invites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await fetch("/api/invites");
        const data = await res.json();
        setInvites(data);
      } catch (err) {
        console.error("Failed to load invites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const acceptInvite = async (token: string) => {
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        alert("Invite accepted!");
        setInvites((prev) => prev.filter((i) => i.token !== token));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to accept invite");
      }
    } catch (error) {
      console.error(error);
      alert("Error accepting invite");
    }
  };

  if (loading) return <p>Loading invites...</p>;

  if (invites.length === 0) {
    return <p>No pending invites 🎉</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Your Invites</h2>
      <ul>
        {invites.map((invite) => (
          <li
            key={invite.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">{invite.tenant.name}</p>
              <p className="text-sm text-gray-500">Role: {invite.role}</p>
            </div>
            <button
              onClick={() => acceptInvite(invite.token)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
