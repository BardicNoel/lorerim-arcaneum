import { Button } from '@/shared/ui/ui/button'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BackToTopButtonProps {
  className?: string
  threshold?: number // Scroll threshold to show the button
}

export function BackToTopButton({ 
  className = '', 
  threshold = 300 
}: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [threshold])

  // Scroll to top function
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer ${className}`}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      <Button
        onClick={scrollToTop}
        size="default"
        variant="outline"
        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 bg-skyrim-gold/90 hover:bg-skyrim-gold text-skyrim-dark border-skyrim-gold hover:border-skyrim-gold backdrop-blur supports-[backdrop-filter]:bg-skyrim-gold/80 hover:supports-[backdrop-filter]:bg-skyrim-gold/95 cursor-pointer"
      >
        <ChevronUp className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]" />
        Back to top
      </Button>
    </div>
  )
}
