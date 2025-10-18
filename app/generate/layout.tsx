import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Plus de vérification onboarding - accès direct à /generate
  return <>{children}</>;
}

