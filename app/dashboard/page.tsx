"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserPlus, Plus ,ChevronDown,X} from "lucide-react";
import AllTenants from "../components/AllTenants";
import Invites from "../components/Invites";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [tenantName, setTenantName] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);

  const createTenant = async () => {
    if (!tenantName) return;
    setLoading(true);
    const res = await fetch("/api/tenants/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenantName }),
    });
    const data = await res.json();
    setTenantId(data.id);
    setSelectedTenantName(data.name);
    setTenantName("");
    setShowCreateModal(false);
    setLoading(false);
  };

  if (status === "loading") {
    return <div className="p-8">Loading workspace...</div>;
  }

  return (
    <div className="p-8">
      {/* Workspace Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {session?.user?.name
            ? `${session.user.name}'s Workspace`
            : "My Workspace"}
        </h1>

        {/* Buttons */}
       <div className="flex items-center space-x-3">
  <button
    onClick={() => setShowInvitesModal(true)}
    className="flex items-center justify-center text-white text-sm font-medium"
  >
    <UserPlus className="w-4 h-4 mr-1" />
    Invites
  </button>
  <button
    onClick={() => setShowCreateModal(true)}
    className="flex items-center text-black bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded-full text-sm"
  >
    <Plus className="w-3.5 h-3.5 mr-1.5" />
    New
  </button>
</div>

      </div>

      {/* All Tenants */}
      <div className="my-8">
        <AllTenants
   
        
        />
      </div>



{showCreateModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
    <div className="relative bg-gray-900 text-white rounded-lg p-6 sm:p-8 shadow-lg max-w-md w-full">
      {/* Close Button (X) */}
      <button
        onClick={() => setShowCreateModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Create Tenant</h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Tenant Name"
        value={tenantName}
        onChange={(e) => setTenantName(e.target.value)}
        className="w-full rounded-xl border border-gray-600 bg-black text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setShowCreateModal(false)}
          className="flex items-center text-white text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={createTenant}
          className="flex items-center text-black bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded-full text-sm"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  </div>
)}




{/* Invites Modal */}
{showInvitesModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
    <div className="relative bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
   
      <button
        onClick={() => setShowInvitesModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Invites</h2>

      {/* Content */}
      <Invites />
    </div>
  </div>
)}

    </div>
  );
}
