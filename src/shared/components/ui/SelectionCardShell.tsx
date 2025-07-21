import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import type { ReactNode } from 'react'

interface SelectionCardShellProps {
  title: string
  navigateTo: string
  onNavigate: () => void
  children: ReactNode
  className?: string
  showHeaderButton?: boolean
}

export function SelectionCardShell({
  title,
  navigateTo,
  onNavigate,
  children,
  className,
  showHeaderButton = true,
}: SelectionCardShellProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showHeaderButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigate}
              className="text-sm whitespace-nowrap cursor-pointer"
            >
              View all {navigateTo} →
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
} 