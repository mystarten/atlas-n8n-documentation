import { ButtonHTMLAttributes } from 'react'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  size?: 'medium' | 'large'
}
export default function Button({ children, variant = 'primary', size = 'medium', className = '', ...props }: ButtonProps) {
  const baseClasses = 'font-black rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 uppercase tracking-wider'
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:from-[#A78BFA] hover:to-[#22D3EE] glow-violet hover:glow-cyan',
    outline: 'border-3 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white'
  }
  const sizeClasses = {
    medium: 'px-8 py-4 text-base',
    large: 'px-12 py-6 text-xl'
  }
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}