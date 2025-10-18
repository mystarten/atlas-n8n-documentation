'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [userType, setUserType] = useState('');
  const [discoverySource, setDiscoverySource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Vérifier si l'onboarding est déjà complété
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('❌ Pas d\'utilisateur, redirection vers login');
          router.push('/login');
          return;
        }

        console.log('✅ Utilisateur trouvé:', user.id);

        // Vérifier onboarding_completed dans profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        // Si onboarding_completed = TRUE, rediriger vers /generate
        if (profile?.onboarding_completed) {
          console.log('✅ Onboarding déjà complété, redirection vers /generate');
          router.push('/generate');
          return;
        }

        console.log('🆕 Onboarding nécessaire, affichage du formulaire');
        setIsCheckingOnboarding(false);
      } catch (error) {
        console.error('❌ Erreur vérification onboarding:', error);
        setIsCheckingOnboarding(false);
      }
    };

    // Timeout de sécurité
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout de sécurité - affichage du formulaire');
      setIsCheckingOnboarding(false);
    }, 3000);

    checkOnboardingStatus();

    return () => clearTimeout(timeout);
  }, [supabase, router]);

  const handleNext = () => {
    if (step === 1 && !firstName.trim()) {
      setError('Veuillez entrer votre prénom');
      return;
    }
    if (step === 2 && !userType) {
      setError('Veuillez sélectionner votre profil');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!discoverySource) {
      setError('Veuillez sélectionner comment vous avez découvert ATLAS');
      return;
    }

    console.log('🚀 Début handleSubmit');
    console.log('📝 Données à sauvegarder:', {
      firstName: firstName.trim(),
      userType,
      discoverySource
    });
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ Pas d\'utilisateur');
        setError('Erreur d\'authentification. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      console.log('✅ User trouvé:', user.id);

      // 1. Sauvegarder les données dans onboarding_data
      console.log('💾 Tentative de sauvegarde dans onboarding_data...');
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: user.id,
          first_name: firstName.trim(),
          user_type: userType,
          discovery_source: discoverySource,
        })
        .select()
        .single();

      if (onboardingError) {
        console.error('❌ Erreur sauvegarde onboarding_data:', onboardingError);
        console.error('❌ Détails erreur:', {
          message: onboardingError.message,
          details: onboardingError.details,
          hint: onboardingError.hint,
          code: onboardingError.code
        });
        setError(`Erreur de sauvegarde: ${onboardingError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Données onboarding sauvegardées:', onboardingData);

      // 2. Marquer onboarding_completed = TRUE dans profiles
      console.log('💾 Tentative de mise à jour onboarding_completed...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('❌ Erreur mise à jour onboarding_completed:', profileError);
        console.error('❌ Détails erreur:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
        setError(`Erreur de mise à jour: ${profileError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Onboarding marqué comme complété');

      // 3. Rediriger vers /generate
      console.log('🚀 Onboarding terminé - REDIRECTION vers /generate');
      router.push('/generate');
      
    } catch (err: any) {
      console.error('💥 Erreur générale:', err);
      setError(`Erreur inattendue: ${err.message || 'Veuillez réessayer.'}`);
      setLoading(false);
    }
  };

  // Affichage de chargement pendant la vérification
  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-[#334155] rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#3b82f6] rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-poppins">Vérification de votre profil</h3>
          <p className="text-[#94a3b8] font-inter">Préparation de votre expérience personnalisée...</p>
        </div>
      </div>
    );
  }

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#3b82f6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="ATLAS" 
            width={60} 
            height={60}
            className="mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-3xl font-bold text-white mb-2 font-poppins">
            Bienvenue sur ATLAS
          </h1>
          <p className="text-[#94a3b8] font-inter">
            Complétez votre profil en quelques secondes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-3 text-center">
            <span className="text-sm text-[#cbd5e1] font-inter">Étape {step} sur 3</span>
          </div>
          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full transition-all duration-700 ease-out shadow-lg shadow-[#3b82f6]/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-8 shadow-2xl shadow-black/50 min-h-[400px] flex flex-col">
          
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[#ef4444] text-sm font-inter">{error}</p>
            </div>
          )}

          {/* Step 1 : Prénom */}
          {step === 1 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex-1">
                <label className="block text-2xl font-bold text-white mb-2 font-poppins">
                  Comment devons-nous vous appeler ?
                </label>
                <p className="text-[#94a3b8] mb-6 font-inter">
                  Votre prénom sera utilisé pour personnaliser votre expérience
                </p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError('');
                  }}
                  placeholder="Entrez votre prénom"
                  className="w-full px-5 py-4 bg-[#0f172a] border border-[#334155] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 transition-all font-inter text-lg"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                />
              </div>
              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/40 hover:shadow-[#3b82f6]/60 hover:scale-[1.02] font-inter text-lg"
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 2 : Type d'utilisateur */}
          {step === 2 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex-1">
                <label className="block text-2xl font-bold text-white mb-2 font-poppins">
                  Quel est votre profil ?
                </label>
                <p className="text-[#94a3b8] mb-6 font-inter">
                  Cela nous aide à personnaliser vos recommendations
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setUserType('creator');
                      setError('');
                    }}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left group ${
                      userType === 'creator'
                        ? 'bg-[#3b82f6]/10 border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20 scale-[1.02]'
                        : 'bg-[#0f172a] border-[#334155] hover:border-[#3b82f6]/50 hover:bg-[#0f172a]/80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                        userType === 'creator' ? 'bg-[#3b82f6]' : 'bg-[#334155] group-hover:bg-[#3b82f6]/50'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1 font-inter">Je partage des workflows</h3>
                        <p className="text-[#94a3b8] text-sm font-inter">Je crée et documente mes templates pour les partager avec d'autres</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setUserType('learner');
                      setError('');
                    }}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left group ${
                      userType === 'learner'
                        ? 'bg-[#3b82f6]/10 border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20 scale-[1.02]'
                        : 'bg-[#0f172a] border-[#334155] hover:border-[#3b82f6]/50 hover:bg-[#0f172a]/80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                        userType === 'learner' ? 'bg-[#3b82f6]' : 'bg-[#334155] group-hover:bg-[#3b82f6]/50'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1 font-inter">J'apprends à utiliser des workflows</h3>
                        <p className="text-[#94a3b8] text-sm font-inter">Je cherche à comprendre et documenter des templates existants</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/40 hover:shadow-[#3b82f6]/60 hover:scale-[1.02] font-inter text-lg"
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 3 : Source de découverte avec logos colorés */}
          {step === 3 && !loading && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex-1">
                <label className="block text-2xl font-bold text-white mb-2 font-poppins">
                  Comment avez-vous découvert ATLAS ?
                </label>
                <p className="text-[#94a3b8] mb-6 font-inter">
                  Cela nous aide à mieux comprendre notre communauté
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      value: 'tiktok', 
                      label: 'TikTok',
                      gradient: 'from-[#00f2ea] to-[#ff0050]',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                        </svg>
                      )
                    },
                    { 
                      value: 'instagram', 
                      label: 'Instagram',
                      gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      )
                    },
                    { 
                      value: 'bouche_a_oreille', 
                      label: 'Bouche-à-oreille',
                      gradient: 'from-[#667eea] to-[#764ba2]',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      )
                    },
                    { 
                      value: 'recherche_google', 
                      label: 'Recherche Google',
                      gradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                        </svg>
                      )
                    },
                    { 
                      value: 'youtube', 
                      label: 'YouTube',
                      gradient: 'from-[#FF0000] to-[#CC0000]',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )
                    },
                    { 
                      value: 'autre', 
                      label: 'Autre',
                      gradient: 'from-[#6366f1] to-[#8b5cf6]',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      )
                    },
                  ].map((source) => (
                    <button
                      key={source.value}
                      onClick={() => {
                        setDiscoverySource(source.value);
                        setError('');
                      }}
                      className={`p-5 rounded-xl border-2 transition-all group relative overflow-hidden ${
                        discoverySource === source.value
                          ? 'border-transparent shadow-2xl scale-[1.02]'
                          : 'border-[#334155] hover:border-[#3b82f6]/50 hover:bg-[#0f172a]/80'
                      }`}
                    >
                      {/* Gradient background when selected */}
                      {discoverySource === source.value && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${source.gradient} opacity-10`}></div>
                      )}
                      
                      <div className="relative flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          discoverySource === source.value 
                            ? `bg-gradient-to-r ${source.gradient} text-white shadow-lg` 
                            : 'bg-[#334155] text-[#cbd5e1] group-hover:bg-[#334155] group-hover:text-white'
                        }`}>
                          {source.icon}
                        </div>
                        <span className={`text-sm font-inter font-medium ${
                          discoverySource === source.value ? 'text-white' : 'text-[#cbd5e1]'
                        }`}>
                          {source.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg shadow-[#3b82f6]/40 hover:shadow-[#3b82f6]/60 hover:scale-[1.02] font-inter text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Terminer
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-[#334155] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-[#3b82f6] rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-poppins">Configuration de votre espace</h3>
              <p className="text-[#94a3b8] font-inter text-center mb-4">Préparation de votre environnement personnalisé...</p>
              
              {/* Boutons de debug temporaires */}
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    console.log('🔄 Debug: Test connexion Supabase');
                    const { data: { user } } = await supabase.auth.getUser();
                    console.log('👤 User:', user);
                    
                    if (user) {
                      const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                      console.log('📋 Profile:', profile);
                    }
                  }}
                  className="px-4 py-2 bg-[#3b82f6] text-white text-sm rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Debug: Test Supabase
                </button>
                
                <button
                  onClick={() => {
                    console.log('🔄 Debug: Forcer redirection vers /generate');
                    router.push('/generate');
                  }}
                  className="px-4 py-2 bg-[#ef4444] text-white text-sm rounded-lg hover:bg-[#dc2626] transition-colors"
                >
                  Debug: Forcer redirection
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}