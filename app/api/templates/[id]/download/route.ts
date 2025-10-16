import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer le template
    const { data: template, error: templateError } = await supabase
      .from('generated_templates')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      )
    }

    // Créer la réponse avec le fichier JSON
    const jsonContent = template.documented_workflow || template.workflow_data || {}
    const fileName = template.file_name || 'template_atlas.json'
    
    return new NextResponse(JSON.stringify(jsonContent, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Erreur téléchargement template:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}

