import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog ATLAS - Automatisation N8N et IA',
  description: 'Guides, tutoriels et bonnes pratiques sur l\'automatisation, N8N et l\'intelligence artificielle',
  keywords: 'N8N, automatisation, IA, workflows, documentation, tutoriels',
};

const articles = [
  {
    id: 'n8n-automatisation-complete-2025',
    title: 'N8N : Le Guide Complet de l\'Automatisation en 2025',
    excerpt: 'Découvrez comment N8N révolutionne l\'automatisation no-code avec plus de 400 intégrations. Guide complet pour débutants et experts.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    date: '15 octobre 2025',
    author: 'Équipe ATLAS',
    category: 'Tutoriel',
    readTime: '12 min',
  },
  {
    id: 'ia-documentation-workflows',
    title: 'Comment l\'IA Transforme la Documentation de Workflows',
    excerpt: 'L\'intelligence artificielle révolutionne la documentation technique. Découvrez les avantages concrets pour votre équipe.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    date: '12 octobre 2025',
    author: 'Équipe ATLAS',
    category: 'IA',
    readTime: '10 min',
  },
  {
    id: '10-workflows-n8n-productivite',
    title: '10 Workflows N8N pour Booster votre Productivité',
    excerpt: 'Des exemples concrets et testés de workflows N8N pour automatiser vos tâches quotidiennes et gagner des heures chaque semaine.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    date: '8 octobre 2025',
    author: 'Équipe ATLAS',
    category: 'Productivité',
    readTime: '15 min',
  },
  {
    id: 'documentation-automatique-avantages',
    title: 'Pourquoi la Documentation Automatique est l\'Avenir',
    excerpt: 'La documentation manuelle prend trop de temps et devient vite obsolète. Découvrez pourquoi l\'automatisation change la donne.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop',
    date: '5 octobre 2025',
    author: 'Équipe ATLAS',
    category: 'Documentation',
    readTime: '8 min',
  },
  {
    id: 'integrer-claude-n8n',
    title: 'Intégrer Claude AI dans vos Workflows N8N',
    excerpt: 'Guide pratique pour connecter l\'API Claude d\'Anthropic à N8N et créer des automatisations intelligentes pas à pas.',
    image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=500&fit=crop',
    date: '1 octobre 2025',
    author: 'Équipe ATLAS',
    category: 'IA',
    readTime: '14 min',
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#0f172a] pt-20">
        
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#3b82f6] font-semibold mb-3 tracking-wider uppercase text-sm font-inter">
              Blog ATLAS
            </p>
            <h1 className="text-6xl font-bold text-white mb-6 font-poppins">
              Automatisation & IA
            </h1>
            <p className="text-xl text-[#cbd5e1] font-inter font-light leading-relaxed">
              Guides, tutoriels et bonnes pratiques pour maîtriser l'automatisation avec N8N et l'intelligence artificielle
            </p>
          </div>
        </section>
        
        {/* Articles Grid */}
        <section className="py-16 px-6 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
          <div className="max-w-7xl mx-auto">
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/blog/${article.id}`}
                  className="group"
                >
                <article className="h-full bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/30 hover:border-[#3b82f6]/50 transition-all duration-500 hover:transform hover:scale-[1.02]">
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-semibold rounded-full font-inter">
                        {article.category}
                      </span>
                      <span className="text-[#64748b] text-xs font-inter">
                        {article.readTime}
                      </span>
                    </div>
                    
                    {/* Titre */}
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#3b82f6] transition-colors line-clamp-2 font-poppins leading-tight">
                      {article.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-[#cbd5e1] text-sm leading-relaxed mb-4 line-clamp-3 font-inter font-light">
                      {article.excerpt}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#334155]/30">
                      <span className="text-[#64748b] text-xs font-inter">
                        {article.date}
                      </span>
                      <svg className="w-5 h-5 text-[#3b82f6] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                  </div>
                    
                  </article>
                </Link>
              ))}
              
            </div>
            
          </div>
        </section>
        
      </main>
    </>
  );
}
