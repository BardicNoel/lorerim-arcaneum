import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/ui/tooltip'

export interface SelectionOption {
  value: string
  label: string
  color: {
    selected: string
    hover: string
    border: string
  }
  disabled?: boolean
  tooltip?: string
}

interface SelectionCardProps {
  title: string
  description?: string
  options: SelectionOption[]
  selectedValue: string | undefined
  onValueChange: (value: string | undefined) => void
  minWidth?: string
  className?: string
  showCategory?: boolean
  category?: string
  // New props for custom styling
  cardClassName?: string | ((selectedValue: string | undefined) => string)
  showCardTheming?: boolean
  // New prop for mutual exclusion
  mutuallyExclusive?: boolean
}

export function SelectionCard({
  title,
  description,
  options,
  selectedValue,
  onValueChange,
  minWidth = 'min-w-[200px]',
  className,
  showCategory = false,
  category,
  cardClassName,
  showCardTheming = false,
  mutuallyExclusive = false,
}: SelectionCardProps) {
  const handleOptionClick = (value: string) => {
    if (selectedValue === value) {
      // Toggle off if already selected
      onValueChange(undefined)
    } else {
      // Select new value (this will automatically deselect the other if mutually exclusive)
      onValueChange(value)
    }
  }

  // Handle custom card styling
  const getCardClassName = () => {
    if (typeof cardClassName === 'function') {
      return cardClassName(selectedValue)
    }
    return cardClassName || ''
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          'group relative bg-card border border-border rounded-lg shadow-sm transition-all duration-200 p-3 flex flex-col min-h-[120px]',
          minWidth,
          showCardTheming && getCardClassName(),
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1">
              {title}
            </h3>
            {showCategory && category && (
              <p className="text-xs text-muted-foreground mt-1">{category}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mb-4 flex-1">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Selection Controls - Always at bottom */}
        <div className="mt-auto pt-2">
          <div className="flex gap-1">
            {options.map(option => {
              const isSelected = selectedValue === option.value
              const isDisabled = option.disabled && !isSelected

              return (
                <Tooltip key={option.value}>
                  <TooltipTrigger asChild>
                    <button
                      disabled={isDisabled}
                      className={cn(
                        'rounded-full px-3 py-2 text-xs font-medium border transition-colors flex-1 relative',
                        // Selected state - use gold color
                        isSelected &&
                          'bg-skyrim-gold text-skyrim-dark border-skyrim-gold shadow-sm',
                        // Unselected state - use static classes for hover
                        !isSelected &&
                          'bg-background text-foreground border-skyrim-gold/30 hover:border-skyrim-gold hover:bg-skyrim-gold/10',
                        // Disabled state - no cursor change
                        isDisabled && 'opacity-50',
                        // Hover effects for enabled buttons
                        !isDisabled && 'hover:shadow-sm'
                      )}
                      onClick={e => {
                        e.stopPropagation()
                        handleOptionClick(option.value)
                      }}
                    >
                      {/* Label with toggle hint */}
                      <span className="flex items-center justify-center gap-1">
                        {isSelected
                          ? `- ${option.label.replace('+ ', '')}`
                          : option.label}
                      </span>
                    </button>
                  </TooltipTrigger>
                  {isDisabled && option.tooltip && (
                    <TooltipContent>
                      <p>{option.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
