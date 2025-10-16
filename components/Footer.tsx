export default function Footer() {
  return (
    <footer className="glass-dark mt-32 border-t border-[#7C3AED]/20">
      <div className="container-custom section-padding">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-8 group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="Atlas Logo" 
              className="h-10 w-10 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" 
            />
            <h3 className="text-4xl font-black text-white group-hover:text-[#7C3AED] transition-colors duration-300">Atlas</h3>
          </div>
          <p className="text-gray-400 mb-10 max-w-3xl mx-auto text-lg leading-relaxed">
            Transformez vos workflows N8N en documentation claire et compréhensible par tous. Propulsé par IA.
          </p>
          <div className="flex justify-center gap-12 mb-12 flex-wrap">
            <a href="#" className="text-gray-400 hover:text-[#7C3AED] transition-colors font-bold text-lg">Fonctionnalités</a>
            <a href="/pricing" className="text-gray-400 hover:text-[#7C3AED] transition-colors font-bold text-lg">Tarifs</a>
            <a href="/documentation" className="text-gray-400 hover:text-[#7C3AED] transition-colors font-bold text-lg">Documentation</a>
            <a href="mailto:contact@atlasbuilder.app" className="text-gray-400 hover:text-[#7C3AED] transition-colors font-bold text-lg">Contact</a>
          </div>
          <div className="border-t border-[#7C3AED]/20 pt-10">
            <p className="text-gray-500 text-sm mb-3">
              <a href="mailto:contact@atlasbuilder.app" className="text-[#7C3AED] hover:text-[#06B6D4] transition-colors font-semibold">
                contact@atlasbuilder.app
              </a>
            </p>
            <p className="text-gray-500 text-sm">© 2025 Atlas Builder. Tous droits réservés. Made with 💜 by Mats</p>
          </div>
        </div>
      </div>
    </footer>
  )
}