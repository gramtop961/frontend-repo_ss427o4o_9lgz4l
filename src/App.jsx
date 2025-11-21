import DatasetUploader from "./components/DatasetUploader";
import PredictForm from "./components/PredictForm";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-5xl mx-auto p-6 space-y-6">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-white">Email Tagging Mini-System</h1>
          <p className="text-blue-200 mt-2">Train per-customer models and predict tags with built-in guardrails.</p>
        </header>

        <DatasetUploader />
        <PredictForm />

        <section className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-2">How customer isolation is enforced</h3>
          <ul className="list-disc list-inside text-blue-200/80 text-sm space-y-1">
            <li>Training builds a separate model for each customer.</li>
            <li>Prediction only considers tags for the same customer.</li>
            <li>Optional allow-list further restricts tags during prediction.</li>
            <li>Simple pattern penalties down‑weight misleading keywords.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default App
