import { useState } from "react";

export default function DatasetUploader({ onTrain }) {
  const [text, setText] = useState(`subject,body,customer_id,tag\nPayment failed,Card declined on checkout,custA,billing\nRefund status,Waiting for refund confirmation,custA,billing\nApp crash,Crashes after login,custA,technical\nDelivery delayed,Package not arrived,custA,shipment\nReset password,Cannot reset password,custB,account\nInvoice needed,Request last month invoice,custB,billing\n`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const parseCSV = (csv) => {
    const lines = csv.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((l) => {
      const parts = [];
      let cur = "";
      let inQ = false;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i];
        if (ch === '"') { inQ = !inQ; continue; }
        if (ch === "," && !inQ) { parts.push(cur); cur = ""; continue; }
        cur += ch;
      }
      parts.push(cur);
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = (parts[idx] || "").trim()));
      return obj;
    });
  };

  const handleTrain = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = parseCSV(text);
      const BASE = import.meta.env.VITE_BACKEND_URL || "";
      const res = await fetch(`${BASE}/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      setResult(json);
      onTrain?.(json);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-2">Upload small CSV dataset</h3>
      <p className="text-blue-200/70 text-sm mb-3">Columns: subject, body, customer_id, tag</p>
      <textarea
        className="w-full h-48 rounded-md bg-slate-900/60 text-blue-100 p-3 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button onClick={handleTrain} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">
          {loading ? "Training..." : "Train"}
        </button>
        {result && (
          <pre className="text-xs text-blue-200/80 overflow-auto max-h-56 bg-slate-900/60 p-3 rounded border border-slate-700 w-full">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
