import { useState } from "react";

export default function PredictForm() {
  const [subject, setSubject] = useState("Refund for delayed package");
  const [body, setBody] = useState("My shipment is late, need refund");
  const [customerId, setCustomerId] = useState("custA");
  const [allowedTags, setAllowedTags] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const BASE = import.meta.env.VITE_BACKEND_URL || "";
      const payload = { subject, body, customer_id: customerId };
      if (allowedTags.trim()) {
        payload.allowed_tags = allowedTags.split(",").map((s) => s.trim()).filter(Boolean);
      }
      const res = await fetch(`${BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-2">Predict tag</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="bg-slate-900/60 text-blue-100 p-2 rounded border border-slate-700" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        <input className="bg-slate-900/60 text-blue-100 p-2 rounded border border-slate-700" placeholder="Customer ID" value={customerId} onChange={(e)=>setCustomerId(e.target.value)} />
        <textarea className="md:col-span-2 bg-slate-900/60 text-blue-100 p-2 rounded border border-slate-700" rows={4} placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)} />
        <input className="md:col-span-2 bg-slate-900/60 text-blue-100 p-2 rounded border border-slate-700" placeholder="Allowed tags (comma separated, optional)" value={allowedTags} onChange={(e)=>setAllowedTags(e.target.value)} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={handlePredict} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">
          {loading ? "Predicting..." : "Predict"}
        </button>
        {result && (
          <pre className="text-xs text-blue-200/80 overflow-auto max-h-56 bg-slate-900/60 p-3 rounded border border-slate-700 w-full">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
