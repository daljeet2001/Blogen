"use client";
import { useEffect, useState } from "react";

type Content = {
  id: string;
  title: string;
  inputText: string;
  outputs: { text: string };
  createdAt: string;
};

export default function ContentLibrary({ tenantId }: { tenantId: string }) {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      const res = await fetch(`/api/tenants/${tenantId}/contents`);
      const data = await res.json();
      setContents(data);
    };
    fetchContents();
  }, [tenantId]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Content Library</h2>
      <ul className="space-y-4">
        {contents.map((c) => (
          <li key={c.id} className="border p-4 rounded">
            <h3 className="font-bold">{c.title}</h3>
            <pre className="whitespace-pre-wrap my-2">{c.outputs.text}</pre>
            <button onClick={() => copyToClipboard(c.outputs.text)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

