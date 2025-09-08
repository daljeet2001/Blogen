"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ use router for navigation

interface UserTenant {
  id: string;
  userId: string;
  tenantId: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  users: UserTenant[];
}

export default function AllTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ hook

  useEffect(() => {
    const fetchTenants = async () => {
      const res = await fetch("/api/tenants");
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      }
      setLoading(false);
    };
    fetchTenants();
  }, []);

  if (loading) return <p className="text-gray-500">Loading tenants...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Tenants</h2>

      {tenants.length === 0 ? (
        <p className="text-gray-500">No tenants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              onClick={() =>
                router.push(`/tenant/${tenant.id}?name=${encodeURIComponent(tenant.name)}`)
              }
              className="bg-gray-900 text-white rounded-lg p-8 cursor-pointer hover:bg-gray-800 transition"
            >
              <h3 className="text-lg font-medium mb-2">{tenant.name}</h3>
              <p className="text-sm text-gray-400">
                {tenant.users && tenant.users.length > 0
                  ? `${tenant.users.length} member${
                      tenant.users.length > 1 ? "s" : ""
                    }`
                  : "no members"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
