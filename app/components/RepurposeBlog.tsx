"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Clipboard, Check } from "lucide-react";
import { Toast } from "./Toast";

type OutputItem = {
  platform: "linkedin" | "twitter" | "facebook";
  text: string;
};

export default function RepurposeBlog({ tenantId }: { tenantId: string }) {
  const [blogText, setBlogText] = useState("");
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const outputsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [blogText]);

  // Auto-scroll to newest output
  useEffect(() => {
    outputsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  const generatePosts = async () => {
    if (!blogText) return alert("Paste your blog first!");
    setLoading(true);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, blogText }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        Toast(errorText || "Something went wrong");
        return;
      }

      const data = await res.json();

      setOutputs((prev) => [
        ...prev,
        { platform: "linkedin", text: data.outputs.linkedin },
        { platform: "twitter", text: data.outputs.twitter },
        { platform: "facebook", text: data.outputs.facebook },
      ]);

      setBlogText("");
    } catch (err: any) {
      Toast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {outputs.length === 0 ? (
        // Initial Centered State
        <div className="flex flex-1 flex-col items-center justify-center px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-200 text-center">
            Repurpose your blog into fresh content ✨
          </h2>
          <div className="flex items-end bg-gray-900 rounded-xl px-3 py-2 w-full max-w-2xl">
            <textarea
              ref={textareaRef}
              placeholder="Paste your blog here..."
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              className="flex-1 bg-transparent resize-none outline-none px-2 py-1 text-sm text-white placeholder-gray-400 max-h-48 overflow-y-auto"
              rows={1}
            />
            <button
              onClick={generatePosts}
              disabled={loading}
              className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="text-sm px-2">...</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ) : (
        // Outputs + Fixed Input
        <>
          {/* Outputs scrollable area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {outputs.map((out, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg p-4 flex items-start space-x-3 relative"
              >
                {/* Platform Icon */}
                <img
                  src={`/${out.platform}.png`}
                  alt={out.platform}
                  className="w-6 h-6 mt-1"
                />

                {/* Output Text */}
                <div className="whitespace-pre-wrap flex-1">{out.text}</div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(out.text, idx)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
            <div ref={outputsEndRef} />
          </div>

          {/* Input stays fixed at bottom */}
          <div className="border-t border-gray-700 p-4 shrink-0">
            <div className="flex items-end bg-gray-900 rounded-xl px-3 py-2">
              <textarea
                ref={textareaRef}
                placeholder="Paste another blog or refine your content..."
                value={blogText}
                onChange={(e) => setBlogText(e.target.value)}
                className="flex-1 bg-transparent resize-none outline-none px-2 py-1 text-sm text-white placeholder-gray-400 max-h-48 overflow-y-auto"
                rows={1}
              />
              <button
                onClick={generatePosts}
                disabled={loading}
                className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                {loading ? (
                  <span className="text-sm px-2">...</span>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
