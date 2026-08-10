import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Badge from './Badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with default props', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary/15')
    // defaults to md size
    expect(badge).toHaveClass('text-sm')
  })

  it('renders with different variants', () => {
    render(<Badge variant="danger">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge).toHaveClass('bg-danger/15')
    expect(badge).toHaveClass('text-danger')
  })

  it('renders with success variant', () => {
    render(<Badge variant="success">Active</Badge>)
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('bg-success/15')
    expect(badge).toHaveClass('text-success')
  })

  it('applies size sm', () => {
    render(<Badge size="sm">Small</Badge>)
    const badge = screen.getByText('Small')
    expect(badge).toHaveClass('text-xs')
  })

  it('applies size lg', () => {
    render(<Badge size="lg">Large</Badge>)
    const badge = screen.getByText('Large')
    expect(badge).toHaveClass('text-base')
  })

  it('dims when disabled', () => {
    render(<Badge disabled>Disabled</Badge>)
    const badge = screen.getByText('Disabled')
    expect(badge).toHaveClass('opacity-50')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })
})
