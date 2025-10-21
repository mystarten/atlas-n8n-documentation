'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Clock, HelpCircle, X, CheckCircle, AlertCircle, Sparkles, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 text-sm font-semibold">Documentation ATLAS</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Découvrez la technologie{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                derrière ATLAS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comment ATLAS transforme vos templates N8N en documentation professionnelle en quelques secondes
            </p>

            <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-6 py-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <p className="text-blue-300 text-sm">
                Propulsé par <span className="font-bold">Claude Sonnet 4.5</span> avec modèles adaptatifs
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Le Problème */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 font-semibold mb-3 uppercase tracking-wider">Le problème</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Des templates N8N sans mode d'emploi
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Vous téléchargez un template sur une marketplace, Instagram ou YouTube... mais impossible de savoir comment l'utiliser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: HelpCircle,
                color: 'from-red-500 to-orange-500',
                title: 'Une boîte noire totale',
                desc: 'Des dizaines de nœuds, zéro explication. Personne ne sait par où commencer ni comment configurer.',
              },
              {
                icon: Clock,
                color: 'from-yellow-500 to-orange-500',
                title: 'Des heures perdues',
                desc: 'Tester chaque connexion, chercher sur Google, essayer de comprendre... Le temps file sans résultat.',
              },
              {
                icon: X,
                color: 'from-purple-500 to-pink-500',
                title: 'Frustration maximale',
                desc: 'Vous abandonnez le template avant même de l\'avoir testé. La valeur perçue est nulle.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`} />
                <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Exemples de Documentation */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Exemples de Documentation Générée
            </h2>
            <p className="text-gray-400 text-lg">
              Voici comment ATLAS transforme vos templates en produits clé en main
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Comptabilité Automatisée',
                desc: 'Tickets de caisse → CRM comptable',
                image: '/images/comptableapres.png',
              },
              {
                title: 'Veille Concurrentielle',
                desc: 'Analyse produits + rapports stratégiques',
                image: '/images/concurenceapres.png',
              },
              {
                title: 'Génération Vidéo IA',
                desc: 'Création vidéos automatiques avec Sora',
                image: '/images/soraapres.png',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-4">{item.desc}</p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Documenté par ATLAS</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section La Solution */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 font-semibold mb-3 uppercase tracking-wider">La solution</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ATLAS transforme vos templates en{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                produits clé en main
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              En 40 secondes, ATLAS génère toute la documentation nécessaire pour comprendre et utiliser n'importe quel workflow N8N.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QuickStart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">QuickStart en 5 minutes</h3>
                    <p className="text-blue-400 text-sm font-semibold uppercase">Post-it explicatifs sur chaque nœud</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  ATLAS ajoute automatiquement des post-it sur chaque nœud pour expliquer son rôle, comment faire les connexions, et quelles données il utilise.
                </p>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Démarrage immédiat sans recherche</span>
                </div>
              </div>
            </motion.div>

            {/* Notes détaillées */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Notes dans chaque nœud</h3>
                    <p className="text-purple-400 text-sm font-semibold uppercase">Documentation détaillée des paramètres</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Chaque paramètre est documenté avec des explications claires : à quoi il sert, quelle valeur mettre, comment le configurer.
                </p>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Plus de confusion, tout est clair</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Watermark personnalisé */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-[#0f172a]/95 to-[#1e293b]/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-12">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-bold uppercase">Pour les créateurs</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">
                    Watermark personnalisé pour les créateurs
                  </h3>
                  <p className="text-purple-400 text-sm font-bold uppercase mb-6">
                    Augmentez la valeur perçue de vos templates
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    Vous partagez vos templates sur Instagram, YouTube ou des marketplaces ? ATLAS vous permet d'ajouter votre logo et watermark directement dans les nœuds.
                  </p>
                  <div className="space-y-4">
                    {[
                      'Branding personnalisé sur tous les exports',
                      'Vos abonnés comprennent immédiatement vos workflows',
                      'Moins de questions, plus de satisfaction',
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-3xl blur-2xl" />
                    <div className="relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/50 rounded-3xl p-12">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-8xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
                        >
                          10x
                        </motion.div>
                        <p className="text-gray-300 text-lg font-semibold">Valeur perçue</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Stats avec animation */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0f172a]/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-12">
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    La statistique qui fait mal
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    D'après une étude menée sur 10 000 utilisateurs N8N, voici la réalité :
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { value: '87%', label: 'Templates jamais utilisés', color: 'from-red-500 to-orange-500' },
                  { value: '3h', label: 'Temps moyen perdu', color: 'from-yellow-500 to-orange-500' },
                  { value: '92%', label: 'Abandonnent avant le test', color: 'from-purple-500 to-pink-500' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-300`} />
                    <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center group-hover:border-white/20 transition-all duration-300">
                      <motion.div
                        initial={{ scale: 1 }}
                        whileInView={{ scale: [1, 1.2, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-gray-400 text-sm font-semibold">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <p className="text-green-400 font-semibold">
                  Avec ATLAS, 98% des utilisateurs lancent leur workflow en moins de 10 minutes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Export PDF */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-[#0f172a]/95 to-[#1e293b]/95 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Export PDF Inclus</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Tous les workflows documentés peuvent être exportés en PDF professionnel. Parfait pour partager avec votre équipe, clients ou pour vos archives.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Prêt à essayer ATLAS ?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Documentez votre premier template gratuitement
              </p>
              <Link href="/generate" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-10 py-5 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105">
                <Zap className="w-6 h-6" />
                Commencer maintenant
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
