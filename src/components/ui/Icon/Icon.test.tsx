import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Icon from './Icon'

describe('Icon', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with default props', () => {
    render(
      <Icon>
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('bg-primary/15')
    // defaults to md size
    expect(icon).toHaveClass('w-12')
    expect(icon).toHaveClass('h-12')
  })

  it('renders with different variants', () => {
    render(
      <Icon variant="danger">
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('bg-danger/15')
    expect(icon).toHaveClass('text-danger')
  })

  it('renders with success variant', () => {
    render(
      <Icon variant="success">
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('bg-success/15')
    expect(icon).toHaveClass('text-success')
  })

  it('applies size sm', () => {
    render(
      <Icon size="sm">
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('w-8')
    expect(icon).toHaveClass('h-8')
  })

  it('applies size lg', () => {
    render(
      <Icon size="lg">
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('w-16')
    expect(icon).toHaveClass('h-16')
  })

  it('dims when disabled', () => {
    render(
      <Icon disabled>
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('opacity-50')
  })

  it('applies custom className', () => {
    render(
      <Icon className="custom-class">
        <svg data-testid="icon-svg" />
      </Icon>
    )
    const icon = screen.getByTestId('icon-svg').parentElement
    expect(icon).toHaveClass('custom-class')
  })
})