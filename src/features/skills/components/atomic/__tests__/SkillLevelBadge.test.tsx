import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SkillLevelBadge } from '../SkillLevelBadge'

describe('SkillLevelBadge', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render level badge when level is greater than 0', () => {
    render(<SkillLevelBadge level={25} />)
    expect(screen.getByText('Min: Level 25')).toBeInTheDocument()
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
    const { getAllByText } = render(<SkillLevelBadge level={25} />)
    const [badge] = getAllByText('Min: Level 25')
    expect(badge.className).toContain('bg-blue-100')
    expect(badge.className).toContain('text-blue-800')
    // default size is "sm"
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('px-2')
    expect(badge.className).toContain('py-1')
  })
})
