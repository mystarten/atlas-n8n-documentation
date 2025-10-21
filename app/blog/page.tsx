'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const articles = [
  {
    slug: 'workflows-n8n-startups-2025',
    title: '10 Workflows N8N Indispensables pour Startups en 2025',
    excerpt: 'Découvrez les automatisations N8N qui vont propulser votre startup et vous faire gagner 20h par semaine.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    category: 'Workflows',
    date: '15 Octobre 2025',
    readTime: '8 min',
  },
  {
    slug: 'ia-automatisation-n8n',
    title: 'Comment l\'IA Transforme l\'Automatisation avec N8N',
    excerpt: 'LangChain, agents IA, RAG systems... Découvrez comment intégrer l\'IA dans vos workflows N8N.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    category: 'Intelligence Artificielle',
    date: '12 Octobre 2025',
    readTime: '10 min',
  },
  {
    slug: 'n8n-vs-make-vs-zapier',
    title: 'N8N vs Make vs Zapier : Le Comparatif Complet 2025',
    excerpt: 'Quel outil d\'automatisation choisir ? Analyse détaillée des forces et faiblesses de chaque plateforme.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Comparatifs',
    date: '8 Octobre 2025',
    readTime: '12 min',
  },
  {
    slug: 'templates-n8n-guide-complet',
    title: 'Templates N8N : Guide Complet pour Débuter',
    excerpt: 'Marketplace, templates gratuits, bonnes pratiques... Tout ce qu\'il faut savoir pour utiliser les templates N8N.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    category: 'Tutoriels',
    date: '5 Octobre 2025',
    readTime: '7 min',
  },
  {
    slug: 'automatiser-comptabilite-n8n',
    title: 'Automatiser sa Comptabilité avec N8N en 2025',
    excerpt: 'Tickets de caisse, factures, relances clients... Automatisez toute votre compta avec ces workflows N8N.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    category: 'Cas d\'usage',
    date: '1 Octobre 2025',
    readTime: '9 min',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Blog ATLAS
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Guides, tutoriels et actualités sur N8N, l&apos;automatisation et l&apos;intelligence artificielle
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link
              key={index}
              href={`/blog/${article.slug}`}
              className="group relative bg-[#0f172a]/95 backdrop-blur-xl border border-[#334155] rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                  {article.title}
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Lire l&apos;article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Envie de tester ATLAS ?
          </h3>
          <p className="text-gray-400 mb-6">
            Documentez vos workflows N8N automatiquement
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            Essayer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
