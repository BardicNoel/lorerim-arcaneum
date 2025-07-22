/**
 * Shared Configuration System for Build Components
 *
 * This follows the birthsigns pattern of centralized theme configuration
 * with functions that return theme values for consistency and maintainability.
 */

// Color mappings for different component types
export const buildColors = {
  traitLimit: {
    regular: 'text-blue-600',
    bonus: 'text-purple-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  },
  confirmDialog: {
    destructive: 'text-red-600',
    safe: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  },
  shareButton: {
    copied: 'text-green-600',
    default: 'text-blue-600',
    hover: 'text-blue-700',
  },
  summaryCard: {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    accent: 'text-accent',
  },
  backgrounds: {
    warning: 'bg-yellow-50 dark:bg-yellow-950',
    info: 'bg-blue-50 dark:bg-blue-950',
    error: 'bg-red-50 dark:bg-red-950',
    success: 'bg-green-50 dark:bg-green-950',
  },
  borders: {
    warning: 'border-yellow-200 dark:border-yellow-800',
    info: 'border-blue-200 dark:border-blue-800',
    error: 'border-red-200 dark:border-red-800',
    success: 'border-green-200 dark:border-green-800',
  },
}

// Icon mappings for different component types
export const buildIcons = {
  traitLimit: {
    regular: 'Circle',
    bonus: 'Star',
    warning: 'AlertTriangle',
    info: 'Info',
  },
  confirmDialog: {
    warning: 'AlertTriangle',
    info: 'Info',
    error: 'XCircle',
    success: 'CheckCircle',
  },
  shareButton: {
    share: 'Share2',
    copied: 'Check',
    link: 'Link',
  },
  summaryCard: {
    race: 'User',
    birthsign: 'Star',
    religion: 'Heart',
    traits: 'Tag',
  },
}

// Spacing and layout patterns
export const buildSpacing = {
  card: 'p-6 space-y-4',
  section: 'space-y-3',
  item: 'space-y-2',
  inline: 'space-x-2',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
}

// Size mappings for consistent sizing
export const buildSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

// Configuration functions (following birthsigns pattern)
export function getTraitLimitColor(
  type: 'regular' | 'bonus' | 'warning' | 'error'
) {
  return buildColors.traitLimit[type]
}

export function getConfirmDialogColor(
  type: 'destructive' | 'safe' | 'warning' | 'info'
) {
  return buildColors.confirmDialog[type]
}

export function getShareButtonColor(type: 'copied' | 'default' | 'hover') {
  return buildColors.shareButton[type]
}

export function getSummaryCardColor(type: 'primary' | 'secondary' | 'accent') {
  return buildColors.summaryCard[type]
}

export function getBackgroundColor(
  type: 'warning' | 'info' | 'error' | 'success'
) {
  return buildColors.backgrounds[type]
}

export function getBorderColor(type: 'warning' | 'info' | 'error' | 'success') {
  return buildColors.borders[type]
}

export function getTraitLimitIcon(
  type: 'regular' | 'bonus' | 'warning' | 'info'
) {
  return buildIcons.traitLimit[type]
}

export function getConfirmDialogIcon(
  type: 'warning' | 'info' | 'error' | 'success'
) {
  return buildIcons.confirmDialog[type]
}

export function getShareButtonIcon(type: 'share' | 'copied' | 'link') {
  return buildIcons.shareButton[type]
}

export function getSummaryCardIcon(
  type: 'race' | 'birthsign' | 'religion' | 'traits'
) {
  return buildIcons.summaryCard[type]
}
