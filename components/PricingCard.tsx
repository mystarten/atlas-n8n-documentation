import Button from './Button'

interface PricingCardProps {
  name: string
  price: number
  period: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export default function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  cta, 
  highlighted = false 
}: PricingCardProps) {
  return (
    <div className={`glass-dark rounded-3xl p-8 hover:scale-105 transition-all duration-500 h-full flex flex-col ${
      highlighted 
        ? 'border-2 border-[#7C3AED] glow-violet' 
        : 'hover:glow-violet'
    }`}>
      {highlighted && (
        <div className="text-center mb-6">
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            Recommandé
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
        <div className="mb-2">
          <span className="text-6xl font-black text-gradient-violet">{price}€</span>
          <span className="text-gray-400 text-xl">{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#06B6D4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button 
          variant={highlighted ? 'primary' : 'outline'} 
          className="w-full"
          size="large"
        >
          {cta}
        </Button>
      </div>
    </div>
  )
}