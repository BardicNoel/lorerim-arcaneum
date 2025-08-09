import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SkillItem } from '../SkillItem'

describe('SkillItem', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    name: 'One-Handed',
    description: 'Weapon skills for swords, axes, and maces',
    category: 'Combat',
    assignmentType: 'none' as const,
    perkCount: '0/10',
    onSelect: vi.fn(),
    onMajorClick: vi.fn(),
    onMinorClick: vi.fn(),
    canAssignMajor: true,
    canAssignMinor: true,
  }

  it('should render skill information correctly', () => {
    render(<SkillItem {...defaultProps} />)

    expect(screen.getByText('One-Handed')).toBeInTheDocument()
    expect(
      screen.getByText('Weapon skills for swords, axes, and maces')
    ).toBeInTheDocument()
    expect(screen.getByText('Combat')).toBeInTheDocument()
    expect(screen.getByText(/0\/10\s*Perks/)).toBeInTheDocument()
  })

  it('should call onSelect when clicking on the card', () => {
    const onSelect = vi.fn()
    render(<SkillItem {...defaultProps} onSelect={onSelect} />)

    fireEvent.click(screen.getByText('One-Handed'))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('should call onMajorClick when clicking Major button', () => {
    const onMajorClick = vi.fn()
    render(<SkillItem {...defaultProps} onMajorClick={onMajorClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Major' }))

    expect(onMajorClick).toHaveBeenCalledTimes(1)
  })

  it('should call onMinorClick when clicking Minor button', () => {
    const onMinorClick = vi.fn()
    render(<SkillItem {...defaultProps} onMinorClick={onMinorClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Minor' }))

    expect(onMinorClick).toHaveBeenCalledTimes(1)
  })

  it('should prevent event bubbling when clicking assignment buttons', () => {
    const onSelect = vi.fn()
    const onMajorClick = vi.fn()
    const onMinorClick = vi.fn()

    render(
      <SkillItem
        {...defaultProps}
        onSelect={onSelect}
        onMajorClick={onMajorClick}
        onMinorClick={onMinorClick}
      />
    )

    // Click Major button
    fireEvent.click(screen.getByRole('button', { name: 'Major' }))
    expect(onMajorClick).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()

    // Click Minor button
    fireEvent.click(screen.getByRole('button', { name: 'Minor' }))
    expect(onMinorClick).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('should show correct button text for major assignment', () => {
    render(<SkillItem {...defaultProps} assignmentType="major" />)

    expect(
      screen.getByRole('button', { name: 'Remove Major' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Minor' })).toBeInTheDocument()
  })

  it('should show correct button text for minor assignment', () => {
    render(<SkillItem {...defaultProps} assignmentType="minor" />)

    expect(screen.getByRole('button', { name: 'Major' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove Minor' })
    ).toBeInTheDocument()
  })

  it('should disable buttons when assignment limits are reached', () => {
    render(
      <SkillItem
        {...defaultProps}
        canAssignMajor={false}
        canAssignMinor={false}
      />
    )

    const majorButton = screen.getByRole('button', { name: 'Major' })
    const minorButton = screen.getByRole('button', { name: 'Minor' })

    expect(majorButton).toBeDisabled()
    expect(minorButton).toBeDisabled()
  })

  it('should not disable buttons for currently assigned skills', () => {
    render(
      <SkillItem
        {...defaultProps}
        assignmentType="major"
        canAssignMajor={false}
        canAssignMinor={false}
      />
    )

    const majorButton = screen.getByRole('button', { name: 'Remove Major' })
    const minorButton = screen.getByRole('button', { name: 'Minor' })

    expect(majorButton).not.toBeDisabled()
    expect(minorButton).toBeDisabled()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <SkillItem {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should show perk count even when totalPerks is 0', () => {
    render(<SkillItem {...defaultProps} perkCount="0/0" />)
    expect(screen.getByText(/0\/0\s*Perks/)).toBeInTheDocument()
  })
})
