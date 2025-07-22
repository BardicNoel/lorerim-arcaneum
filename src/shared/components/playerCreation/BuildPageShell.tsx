import React from 'react'

interface BuildPageShellProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export const BuildPageShell = ({
  children,
  title,
  description,
  className = '',
}: BuildPageShellProps) => {
  return (
    <div className={`container mx-auto p-6 space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2 max-w-4xl">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
