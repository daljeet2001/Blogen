"use client";
import { useState } from "react";
import InviteMembers from "../components/InviteMembers";
import TeamList from "../components/TeamList";
import AllTenants from "../components/AllTenants";
import Invites from "../components/Invites";
import RepurposeBlog from "../components/RepurposeBlog";
import ContentLibrary from "../components/ContentLibrary";

export default function Dashboard() {
  const [tenantName, setTenantName] = useState("");
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const createTenant = async () => {
    if (!tenantName) return alert("Enter tenant name");
    setLoading(true);
    const res = await fetch("/api/tenants/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenantName }),
    });
    const data = await res.json();
    setTenantId(data.id);
    setSelectedTenantName(data.name);
    alert(`Tenant created: ${data.name}`);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Create Tenant */}
      <div className="bg-white p-6 rounded shadow max-w-md">
        <input
          type="text"
          placeholder="Tenant Name"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={createTenant}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Tenant"}
        </button>
      </div>

      {/* Invites */}
      <h2>Invites</h2>
      <Invites />

      {/* All Tenants */}
      <div className="my-8">
        <AllTenants
          onSelectTenant={(id, name) => {
            setTenantId(id);
            setSelectedTenantName(name);
          }}
        />
      </div>

      {/* Show members + invites when tenant is selected */}
      {tenantId && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Tenant: <span className="text-blue-600">{selectedTenantName}</span>
          </h2>
          <InviteMembers tenantId={tenantId} />
          <TeamList tenantId={tenantId} />
          <RepurposeBlog tenantId={tenantId} />
          <ContentLibrary tenantId={tenantId} />
        </div>
      )}
    </div>
  );
}
