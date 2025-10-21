export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Erreur de confirmation</h1>
        <p className="text-gray-400 mb-6">
          Le lien de confirmation est invalide ou a expiré.
        </p>
        <a
          href="/login"
          className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition"
        >
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}
