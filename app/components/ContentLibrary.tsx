"use client";

import { useState, useEffect } from "react";
import { Clipboard, Check, Trash2, Edit3, Save } from "lucide-react";

type ContentItem = {
  id: string;
  outputs: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
};

export default function ContentLibrary({ tenantId }: { tenantId: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [copied, setCopied] = useState<{ id: string; platform: string } | null>(null);
  const [editing, setEditing] = useState<{ id: string; platform: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(`/api/tenants/${tenantId}/contents`);
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, [tenantId]);

  const copyToClipboard = (text: string, id: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ id, platform });
    setTimeout(() => setCopied(null), 1500);
  };

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Permission denied or error deleting content");
    }
  };

  const startEditing = (id: string, platform: string, currentValue: string) => {
    setEditing({ id, platform });
    setEditValue(currentValue);
  };

  const saveEdit = async (id: string, platform: string) => {
    const res = await fetch(`/api/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, text: editValue }),
    });

    if (res.ok) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                outputs: {
                  ...item.outputs,
                  [platform]: editValue,
                },
              }
            : item
        )
      );
      setEditing(null);
      setEditValue("");
    } else {
      alert("Permission denied or error updating content");
    }
  };

  const platforms: { key: "linkedin" | "twitter" | "facebook"; label: string }[] = [
    { key: "linkedin", label: "LinkedIn" },
    { key: "twitter", label: "Twitter" },
    { key: "facebook", label: "Facebook" },
  ];

  return (
    <div className="flex flex-col h-full text-white">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {items.length === 0 ? (
          <div className="text-center text-gray-400">No content yet</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 rounded-lg p-4 space-y-4 relative"
            >
              {/* Delete button top-right */}
              <button
                onClick={() => deleteItem(item.id)}
                className="absolute top-3 -right-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {platforms.map(
                (p) =>
                  item.outputs[p.key] && (
                    <div
                      key={p.key}
                      className="bg-gray-800 rounded-lg p-4 flex items-start space-x-3 relative"
                    >
                      <img
                        src={`/${p.key}.png`}
                        alt={p.label}
                        className="w-6 h-6 mt-1"
                      />

                      {/* Inline editing */}
                      <div className="flex-1 text-sm">
                        {editing?.id === item.id && editing?.platform === p.key ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(item.id, p.key)}
                            className="w-full bg-gray-700 text-white rounded p-2 text-sm resize-none"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{item.outputs[p.key]}</div>
                        )}
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() =>
                          copyToClipboard(item.outputs[p.key]!, item.id, p.key)
                        }
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        {copied?.id === item.id && copied?.platform === p.key ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit Button */}
                      {editing?.id === item.id && editing?.platform === p.key ? (
                        <button
                          onClick={() => saveEdit(item.id, p.key)}
                          className="ml-2 text-green-500 hover:text-green-400"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            startEditing(item.id, p.key, item.outputs[p.key]!)
                          }
                          className="ml-2 text-gray-400 hover:text-blue-400"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
              )}
            </div>
          ))
        )}
      </div>

      {/* Scoped CSS for custom scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555; /* fixed color */
        }
      `}</style>
    </div>
  );
}
