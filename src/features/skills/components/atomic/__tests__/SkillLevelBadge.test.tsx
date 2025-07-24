import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SkillLevelBadge } from '../SkillLevelBadge'

describe('SkillLevelBadge', () => {
  it('should render level badge when level is greater than 0', () => {
    render(<SkillLevelBadge level={25} />)
    expect(screen.getByText('Min: Level 25')).toBeDefined()
  })

  it('should not render when level is 0', () => {
    const { container } = render(<SkillLevelBadge level={0} />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render when level is negative', () => {
    const { container } = render(<SkillLevelBadge level={-5} />)
    expect(container.firstChild).toBeNull()
  })

  it('should apply correct styling classes', () => {
    render(<SkillLevelBadge level={25} />)
    const badge = screen.getByText('Min: Level 25')
    expect(badge.className).toContain('bg-blue-100')
    expect(badge.className).toContain('text-blue-800')
  })
}) 