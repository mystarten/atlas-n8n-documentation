import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'ATLAS - Documentation automatique pour workflows N8N'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #0B1120 0%, #1A1F3A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 80,
            marginBottom: 30,
            background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          ATLAS
        </div>
        <div
          style={{
            fontSize: 40,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Documentation automatique pour workflows N8N
        </div>
        <div
          style={{
            fontSize: 28,
            textAlign: 'center',
            color: '#06B6D4',
            marginTop: 20,
          }}
        >
          Générez vos templates en 30 secondes avec IA
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

