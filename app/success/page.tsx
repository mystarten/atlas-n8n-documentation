export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500/40 rounded-3xl p-12 max-w-2xl text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Paiement réussi !
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de votre plan.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          Commencer à générer
        </a>
      </div>
    </div>
  )
}


