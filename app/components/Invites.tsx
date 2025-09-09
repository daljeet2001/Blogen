"use client";
import { useEffect, useState } from "react";
import { Toast } from './Toast';
import { ToastSuccess } from './Toast';

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
        ToastSuccess("Invite accepted!");
        setInvites((prev) => prev.filter((i) => i.token !== token));
      } else {
        const err = await res.json();
        Toast(err.error || "Failed to accept invite");
      }
    } catch (error) {
      console.error(error);
      Toast("Error accepting invite");
    }
  };

  if (loading) return <p>Loading invites...</p>;

  if (invites.length === 0) {
    return <p>No pending invites.</p>;
  }

  return (
    <div className="p-6 rounded  max-w-lg mt-6">
      {/* <h2 className="text-xl font-bold mb-4">Your Invites</h2> */}
      <ul>
        {invites.map((invite) => (
          <li
            key={invite.id}
            className="flex justify-between items-center py-2"
          >
            <div>
              <p className="font-medium">{invite.tenant.name}</p>
            </div>
            <button
              onClick={() => acceptInvite(invite.token)}
              className="flex items-center text-black bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded-full text-sm"
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
