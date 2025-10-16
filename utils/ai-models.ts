export const getAIModels = (tier: string) => {
  switch(tier) {
    case 'free':
      return {
        notes: 'gpt-4o-mini',
        pdf: null
      }
    case 'starter':
      return {
        notes: 'gpt-4o-mini',
        pdf: 'claude-3-5-haiku-20241022'
      }
    case 'pro':
      return {
        notes: 'claude-3-5-haiku-20241022',
        pdf: 'claude-3-5-sonnet-20241022'
      }
    case 'enterprise':
      return {
        notes: 'claude-3-5-haiku-20241022',
        pdf: 'claude-sonnet-4-20241022'
      }
    default:
      return {
        notes: 'gpt-4o-mini',
        pdf: null
      }
  }
}

export const getModelDisplayName = (tier: string) => {
  switch(tier) {
    case 'free':
      return 'IA Standard'
    case 'starter':
      return 'IA Optimisée'
    case 'pro':
      return 'Claude Sonnet 3.5'
    case 'enterprise':
      return 'Claude Sonnet 4'
    default:
      return 'IA Standard'
  }
}

