"use client";
import { useState } from "react";

export default function RepurposeBlog({ tenantId }: { tenantId: string }) {
  const [title, setTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [outputs, setOutputs] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const generatePosts = async () => {
  if (!title || !blogText) return alert("Fill all fields");
  setLoading(true);

  try {
    const res = await fetch("/api/repurpose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, title, blogText }),
    });

    if (!res.ok) {
      // If the response status is not 2xx, show an alert with the error
      const errorText = await res.text();
      alert(errorText || "Something went wrong");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setOutputs(data.outputs.text);
  } catch (err: any) {
    alert(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Repurpose Blog</h2>

      <input type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <textarea placeholder="Paste your blog here"
        value={blogText}
        onChange={(e) => setBlogText(e.target.value)}
        className="border p-2 rounded w-full h-40 mb-4"
      />
      <button onClick={generatePosts}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Generating..." : "Generate Posts"}
      </button>

      {outputs && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Generated Outputs:</h3>
          <pre className="whitespace-pre-wrap">{outputs}</pre>
        </div>
      )}
    </div>
  );
}

