import { cleanup, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AttributeStatBar } from '../AttributeStatBar'

describe('AttributeStatBar', () => {
  beforeEach(() => {
    cleanup()
  })

  it('should render with correct label and value', () => {
    render(<AttributeStatBar value={100} label="Health" />)

    expect(screen.getByText('Health')).toBeDefined()
    expect(screen.getByText('100')).toBeDefined()
  })

  it('should apply correct color classes', () => {
    const { rerender } = render(
      <AttributeStatBar value={100} label="Health" color="red" />
    )

    let progressBar = screen
      .getByText('Health')
      .closest('div')
      ?.querySelector('div[class*="bg-red-500"]')
    expect(progressBar).toBeDefined()

    rerender(<AttributeStatBar value={100} label="Stamina" color="green" />)
    progressBar = screen
      .getByText('Stamina')
      .closest('div')
      ?.querySelector('div[class*="bg-green-500"]')
    expect(progressBar).toBeDefined()

    rerender(<AttributeStatBar value={100} label="Magicka" color="blue" />)
    progressBar = screen
      .getByText('Magicka')
      .closest('div')
      ?.querySelector('div[class*="bg-blue-500"]')
    expect(progressBar).toBeDefined()
  })

  it('should hide value when showValue is false', () => {
    render(<AttributeStatBar value={100} label="Health" showValue={false} />)

    expect(screen.getByText('Health')).toBeDefined()
    expect(screen.queryByText('100')).toBeNull()
  })
})
