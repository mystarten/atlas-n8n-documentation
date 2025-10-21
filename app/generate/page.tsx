import GenerateClient from './GenerateClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GeneratePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupérer les stats utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <GenerateClient 
      userEmail={user.email || ''}
      profile={profile}
      companyName={profile?.company_name || ''} // ← AJOUTE ÇA !
    />
  );
}
