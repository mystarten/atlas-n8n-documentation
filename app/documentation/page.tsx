'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-20">
        
        {/* Hero */}
        <div className="text-center mb-24 pt-16">
          {/* Logo Atlas */}
          <div className="mb-12">
            <Image 
              src="/logo.png" 
              alt="Atlas Logo" 
              width={120} 
              height={120}
              className="mx-auto"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            Documentation{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Atlas
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez la technologie derrière la génération automatique de documentation pour vos workflows N8N
          </p>
          
          <div className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold text-base">
              Propulsé par <strong className="font-bold">Claude Sonnet 4.5</strong> avec modèles adaptatifs
            </span>
          </div>
        </div>

        {/* Section 1 - Le Problème */}
        <section className="mb-32">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Le problème des templates non documentés
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Problème 1 */}
                <div className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        Impossible à comprendre
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Les workflows N8N partagés sur les forums et marketplaces sont de véritables 
                        boîtes noires. Sans documentation, impossible de savoir quels credentials sont 
                        nécessaires, quelles variables configurer, ou comment tester le workflow.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problème 2 */}
                <div className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        Perte de temps massive
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        Résultat : 2 à 4 heures perdues par template pour deviner la configuration, 
                        comprendre la logique, et faire fonctionner l'automation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image exemple - Réduite et optimisée */}
              <div className="mt-10">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-slate-800/80 rounded-2xl border border-slate-700 p-6 backdrop-blur-sm">
                    <div className="space-y-4">
                      {/* Toggle 1 */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <span className="text-gray-300 text-sm font-medium">Always Output Data</span>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Toggle 2 */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <span className="text-gray-300 text-sm font-medium">Execute Once</span>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Toggle 3 */}
                      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <span className="text-gray-300 text-sm font-medium">Retry On Fail</span>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>À quoi servent ces options ?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - La Solution */}
        <section className="mb-32">
          <div className="bg-gradient-to-br from-cyan-900/10 to-transparent border-2 border-cyan-500/30 rounded-3xl p-12 hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all duration-500 group">
            <h2 className="text-5xl font-bold text-white mb-10 group-hover:scale-105 transition-transform">
              Documentation automatique par IA
            </h2>
            
            <p className="text-gray-300 text-xl leading-relaxed mb-12">
              Atlas transforme vos workflows bruts en templates professionnels prêts à l'emploi, 
              grâce à une combinaison unique d'IA enrichie et de traitement JavaScript avancé.
            </p>

            {/* Cartes technologie */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Carte 1 */}
              <div className="bg-gradient-to-br from-blue-900/30 to-transparent border-2 border-blue-500/40 rounded-2xl p-8 hover:border-blue-500/80 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600/30 border-2 border-blue-500/50 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-300 mx-auto mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">IA enrichie N8N</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Intelligence artificielle spécialement entraînée sur l'écosystème N8N pour comprendre la logique des workflows
                </p>
              </div>

              {/* Carte 2 */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-transparent border-2 border-cyan-500/40 rounded-2xl p-8 hover:border-cyan-500/80 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-600/30 border-2 border-cyan-500/50 rounded-xl flex items-center justify-center text-2xl font-bold text-cyan-300 mx-auto mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Claude Sonnet 4.5</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Modèle d'IA de pointe avec modèles adaptatifs pour analyser la logique complexe et générer des instructions claires
                </p>
              </div>

              {/* Carte 3 */}
              <div className="bg-gradient-to-br from-blue-900/30 to-transparent border-2 border-blue-500/40 rounded-2xl p-8 hover:border-blue-500/80 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600/30 border-2 border-blue-500/50 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-300 mx-auto mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Fonctions JS avancées</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Traitement JavaScript complexe pour parser, enrichir et structurer la documentation
                </p>
              </div>
            </div>

            {/* Image après */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl">
                <Image 
                  src="/apres.png" 
                  alt="Template avec documentation" 
                  width={800} 
                  height={450}
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-center text-gray-400 mt-6 italic text-lg">
                Le même template documenté par Atlas : utilisable en 10 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 - Comment ça marche */}
        <section className="mb-32">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Comment fonctionne la génération
          </h2>

          <div className="space-y-8">
            {/* Étape 1 */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 rounded-3xl p-10 hover:border-blue-500/60 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-500 group">
              <div className="flex items-start gap-8">
                <div className="text-6xl font-bold text-blue-400 flex-shrink-0 group-hover:scale-125 transition-transform">01</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Parsing du workflow JSON</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Votre fichier N8N est analysé en profondeur par des fonctions JavaScript avancées. 
                    Chaque nœud, chaque connexion, chaque paramètre est extrait et structuré.
                  </p>
                  <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6 font-mono text-sm">
                    <pre className="text-cyan-300 overflow-x-auto">
{`// Extraction de la structure du workflow
const nodes = workflow.nodes.map(node => ({
  id: node.id,
  type: node.type,
  parameters: node.parameters,
  credentials: node.credentials
}))`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-cyan-900/20 border-2 border-cyan-500/30 rounded-3xl p-10 hover:border-cyan-500/60 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-500 group">
              <div className="flex items-start gap-8">
                <div className="text-6xl font-bold text-cyan-400 flex-shrink-0 group-hover:scale-125 transition-transform">02</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Analyse par IA enrichie N8N</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Notre IA, spécialement enrichie avec des connaissances sur l'écosystème N8N, 
                    analyse la logique du workflow. Elle comprend les intégrations, les déclencheurs, 
                    et les transformations de données.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                      <div className="font-semibold text-cyan-300 mb-2">Détection automatique</div>
                      <div className="text-gray-400 text-sm">Identifie les APIs, webhooks, et services</div>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                      <div className="font-semibold text-cyan-300 mb-2">Analyse des connexions</div>
                      <div className="text-gray-400 text-sm">Comprend le flux de données entre nœuds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 rounded-3xl p-10 hover:border-blue-500/60 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-500 group">
              <div className="flex items-start gap-8">
                <div className="text-6xl font-bold text-blue-400 flex-shrink-0 group-hover:scale-125 transition-transform">03</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Génération intelligente avec Claude Sonnet 4.5</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Claude Sonnet 4.5 avec modèles adaptatifs prend le relais pour générer une documentation structurée, 
                    claire et professionnelle. Le modèle crée des instructions précises, 
                    identifie les prérequis, et propose des exemples de configuration.
                  </p>
                  <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6 font-mono text-sm">
                    <pre className="text-blue-300 overflow-x-auto">
{`// Génération de la documentation
const prompt = buildEnrichedPrompt(nodes, connections)
const documentation = await claude.generate({
  model: 'claude-sonnet-4.5',
  prompt: prompt,
  context: 'N8N workflow documentation'
})`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-cyan-900/20 border-2 border-cyan-500/30 rounded-3xl p-10 hover:border-cyan-500/60 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-500 group">
              <div className="flex items-start gap-8">
                <div className="text-6xl font-bold text-cyan-400 flex-shrink-0 group-hover:scale-125 transition-transform">04</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Enrichissement et formatage final</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Des fonctions JavaScript complexes enrichissent la documentation générée : 
                    ajout d'exemples de credentials, création de checklists de test, 
                    formatage Markdown professionnel, et structuration des sections.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform">
                      <div className="font-semibold text-cyan-300 text-sm">Checklists</div>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform">
                      <div className="font-semibold text-cyan-300 text-sm">Exemples</div>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform">
                      <div className="font-semibold text-cyan-300 text-sm">Tests</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 - Résultat */}
        <section className="mb-32">
          <div className="bg-gradient-to-br from-blue-900/10 via-cyan-900/10 to-cyan-900/10 border-2 border-blue-500/30 rounded-3xl p-12 hover:border-blue-500/50 hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-all duration-500">
            <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ce que vous obtenez
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Description complète du workflow</h3>
                    <p className="text-gray-400">Objectif, cas d'usage, et fonctionnement général</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Prérequis techniques détaillés</h3>
                    <p className="text-gray-400">API keys, webhooks, et configurations nécessaires</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Instructions étape par étape</h3>
                    <p className="text-gray-400">Configuration complète de chaque nœud</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Exemples de credentials</h3>
                    <p className="text-gray-400">Format et structure des clés API requises</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Procédure de test complète</h3>
                    <p className="text-gray-400">Comment vérifier que tout fonctionne correctement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Prêt à l'emploi en 10 minutes</h3>
                    <p className="text-gray-400">Template immédiatement utilisable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-xl hover:scale-110 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300"
          >
            Essayer Atlas maintenant
          </Link>
        </div>
      </div>
    </div>
  )
}