/**
 * Sanitizes strings for display by converting underscores to spaces and applying proper formatting
 */

/**
 * Converts underscore-separated strings to user-friendly format
 * Example: "stat_modifications" -> "Stat Modifications"
 */
export function sanitizeUnderscoreString(text: string): string {
  if (!text) return text
  
  return text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Sanitizes effect names and descriptions for display
 * Handles various patterns found in religion data
 */
export function sanitizeEffectText(text: string): string {
  if (!text) return text

  let sanitized = text

  // Replace common variable patterns with user-friendly terms
  sanitized = sanitized
    // Global variable patterns - use function to handle complex replacements
    .replace(/Global=WSN_Favor_Global_Fractional(\d*)/g, (match, digits) => 
      `favor-based amount${digits || ''}`
    )
    .replace(/Global=WSN_Favor_Global/g, 'favor-based amount')
    .replace(/WSN_Favor_Global_Fractional(\d*)/g, (match, digits) => 
      `favor-based amount${digits || ''}`
    )
    .replace(/WSN_Favor_Global/g, 'favor-based amount')
    .replace(/WSN_Effect_Global_[A-Za-z]+/g, 'effect amount')
    .replace(/WSN_[A-Za-z_]+/g, 'favor-based amount')
    
    // General underscore patterns (but preserve angle brackets)
    .replace(/([A-Za-z])_([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])_([A-Za-z])/g, '$1 $2') // Apply twice to catch nested underscores
    
    // Clean up any remaining underscores (but not inside angle brackets)
    .replace(/(?<!<)_(?!>)/g, ' ')

  return sanitized
}

/**
 * Sanitizes target attribute names for display
 * Example: "MagicResist" -> "Magic Resistance"
 */
export function sanitizeTargetAttribute(attribute: string | null): string {
  if (!attribute) return ''
  
  return attribute
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^ /, '') // Remove leading space
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
}

/**
 * Sanitizes effect names for display
 */
export function sanitizeEffectName(effectName: string): string {
  if (!effectName) return ''
  
  // First sanitize the text, then capitalize properly
  const sanitized = sanitizeEffectText(effectName)
  return sanitized.replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Sanitizes effect descriptions for display
 */
export function sanitizeEffectDescription(description: string): string {
  if (!description) return ''
  
  return sanitizeEffectText(description)
}
