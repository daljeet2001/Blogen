"use client";
import { useEffect, useState } from "react";

type UserTenant = { id: string; user: { name: string; email: string }; role: string };

export default function TeamList({ tenantId }: { tenantId: string }) {
  const [members, setMembers] = useState<UserTenant[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`/api/tenants/${tenantId}/members`);
      const data = await res.json();
      setMembers(data);
    };
    fetchMembers();
  }, [tenantId]);

  return (
    <div className="mt-6  p-6 rounded shadow max-w-lg">

      <ul>
        {members.map((m) => (
          <li key={m.id} className="flex justify-between mb-2">
            <span>{m.user.name || m.user.email}</span>
           <span className="text-gray-500">
  { m.role.toLowerCase()}
</span>

          </li>
        ))}
      </ul>
    </div>
  );
}

