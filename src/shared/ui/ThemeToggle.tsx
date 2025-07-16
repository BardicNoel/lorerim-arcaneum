import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/shared/context/ThemeContext'
import { Button } from '@/shared/ui/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8"
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to cycle themes.`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 