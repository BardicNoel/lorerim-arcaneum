/**
 * Z-Index constants for consistent layering throughout the application
 * Higher numbers appear on top
 */
export const Z_INDEX = {
  // Base content layer
  BASE: 0,
  
  // Page content and cards
  CONTENT: 1,
  CARD: 2,
  
  // Interactive elements
  BUTTON: 10,
  INPUT: 20,
  
  // Dropdowns and overlays
  DROPDOWN: 100,
  TOOLTIP: 150,
  MODAL: 200,
  
  // Navigation and headers
  HEADER: 50,
  SIDEBAR: 60,
  NAVIGATION: 70,
  
  // Sticky elements
  STICKY: 40,
  
  // Autocomplete and search
  AUTOCOMPLETE: 120,
  
  // Notifications and alerts
  NOTIFICATION: 300,
  TOAST: 350,
  
  // Maximum z-index for critical overlays
  MAX: 999
} as const

export type ZIndexKey = keyof typeof Z_INDEX 