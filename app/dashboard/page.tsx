"use client";
import { useState, useEffect } from "react";
import InviteMembers
 from "../components/InviteMembers";
import TeamList from "../components/TeamList";

export default function Dashboard() {
  const [tenantName, setTenantName] = useState("");
  const [tenantId, setTenantId] = useState<string | null>(null);
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
    alert(`Tenant created: ${data.name}`);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded shadow max-w-md">
        <input type="text"
          placeholder="Tenant Name"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button onClick={createTenant}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Tenant"}
        </button>
      </div>

        {tenantId && (
          <>
            <InviteMembers tenantId={tenantId} />
            <TeamList tenantId={tenantId} />
          </>
        )}
    </div>
  );
}

