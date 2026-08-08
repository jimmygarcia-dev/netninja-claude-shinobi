import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders initials from a single-word name', () => {
    render(<Avatar name="Jimmy" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders two initials for a multi-word name', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
  })

  it('handles hyphenated names', () => {
    render(<Avatar name="jane-doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('uppercases lowercase initials', () => {
    render(<Avatar name="alex" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('falls back to "?" when name is missing', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('falls back to "?" when name is blank whitespace', () => {
    render(<Avatar name="   " />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders as a round, gradient-filled chip', () => {
    const { container } = render(<Avatar name="Sam" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveClass('rounded-full')
    expect(chip).toHaveClass('bg-gradient-to-br')
    expect(chip).toHaveClass('from-primary')
    expect(chip).toHaveClass('to-accent')
  })

  it('applies the small size classes by default', () => {
    const { container } = render(<Avatar name="Sam" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveClass('w-8')
    expect(chip).toHaveClass('h-8')
    expect(chip).toHaveClass('text-xs')
  })

  it('applies the medium size classes when size="md"', () => {
    const { container } = render(<Avatar name="Sam" size="md" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveClass('w-10')
    expect(chip).toHaveClass('h-10')
    expect(chip).toHaveClass('text-sm')
  })

  it('applies the large size classes when size="lg"', () => {
    const { container } = render(<Avatar name="Sam" size="lg" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveClass('w-16')
    expect(chip).toHaveClass('h-16')
    expect(chip).toHaveClass('text-xl')
  })

  it('forwards className to the chip', () => {
    const { container } = render(<Avatar name="Sam" className="mr-2" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveClass('mr-2')
  })

  it('uses the explicit title verbatim for the aria-label when provided', () => {
    render(<Avatar name="JL" title="Jane Larkin" />)
    expect(screen.getByLabelText('Jane Larkin')).toBeInTheDocument()
  })

  it('falls back to the name in the aria-label when no title is given', () => {
    render(<Avatar name="Jane Larkin" />)
    expect(screen.getByLabelText('Jane Larkin avatar')).toBeInTheDocument()
  })

  it('exposes itself as an image role for assistive tech', () => {
    const { container } = render(<Avatar name="Jane" />)
    const chip = container.firstChild as HTMLElement
    expect(chip).toHaveAttribute('role', 'img')
  })
})
