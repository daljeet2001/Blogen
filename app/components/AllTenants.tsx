"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export default function AllTenants({
  onSelectTenant,
}: {
  onSelectTenant: (id: string, name: string) => void;
}) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">All Tenants</h2>

      {tenants.length === 0 ? (
        <p className="text-gray-500">No tenants found.</p>
      ) : (
        <ul className="space-y-3">
          {tenants.map((tenant) => (
            <li
              key={tenant.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{tenant.name}</p>
                <p className="text-sm text-gray-500">
                  Role: {tenant.role} | Created:{" "}
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onSelectTenant(tenant.id, tenant.name)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <Eye className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
