import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with default props', () => {
    render(<Avatar name="John Doe" />)
    const avatar = screen.getByText('J')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveClass('w-8', 'h-8', 'bg-gradient-to-br')
  })

  it('displays correct initial from name', () => {
    render(<Avatar name="alice smith" />)
    const avatar = screen.getByText('A')
    expect(avatar).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    render(<Avatar name="Test User" size="lg" />)
    const avatar = screen.getByText('T')
    expect(avatar).toHaveClass('w-12', 'h-12')
  })

  it('renders with different variants', () => {
    render(<Avatar name="Test User" variant="primary" />)
    const avatar = screen.getByText('T')
    expect(avatar).toHaveClass('bg-primary')
  })

  it('applies custom className', () => {
    render(<Avatar name="Test User" className="custom-class" />)
    const avatar = screen.getByText('T')
    expect(avatar).toHaveClass('custom-class')
  })

  it('handles empty name gracefully', () => {
    render(<Avatar name="" />)
    const avatar = document.querySelector('.rounded-full')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveTextContent('')
  })

  it('handles single character name', () => {
    render(<Avatar name="X" />)
    const avatar = screen.getByText('X')
    expect(avatar).toBeInTheDocument()
  })
})