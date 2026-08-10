import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  afterEach(() => {
    cleanup()
  })

  it('does not render when open is false', () => {
    render(<Modal open={false} onClose={() => {}}>Hidden content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('renders when open is true', () => {
    render(
      <Modal open onClose={() => {}}>
        Hello modal
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Hello modal')).toBeInTheDocument()
  })

  it('renders title and description with proper aria wiring', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="Confirm action"
        description="This cannot be undone."
      >
        Body
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
    expect(screen.getByText('Confirm action')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} title="Title">
        Body
      </Modal>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose}>
        Body
      </Modal>,
    )
    // The backdrop is the outer fixed wrapper that hosts the dialog.
    const dialog = screen.getByRole('dialog')
    const backdrop = dialog.parentElement as HTMLElement
    fireEvent.mouseDown(backdrop)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on backdrop click when disableBackdropClose is true', () => {
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} disableBackdropClose>
        Body
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    const backdrop = dialog.parentElement as HTMLElement
    fireEvent.mouseDown(backdrop)
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('closes on Escape by default', () => {
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose}>
        Body
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on Escape when disableEscapeClose is true', () => {
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} disableEscapeClose>
        Body
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('hides the close button when hideCloseButton is true', () => {
    render(
      <Modal open onClose={() => {}} title="Title" hideCloseButton>
        Body
      </Modal>,
    )
    expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        footer={<button>Confirm</button>}
      >
        Body
      </Modal>,
    )
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('applies variant-specific classes for each variant', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning'] as const
    variants.forEach((variant) => {
      cleanup()
      render(
        <Modal open onClose={() => {}} variant={variant} title={`${variant} title`}>
          Body
        </Modal>,
      )
      const title = screen.getByText(`${variant} title`)
      expect(title).toBeInTheDocument()
    })
  })

  it('applies size classes for each size', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    const expectedClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
    }
    sizes.forEach((size) => {
      cleanup()
      render(
        <Modal open onClose={() => {}} size={size}>
          Body
        </Modal>,
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass(expectedClasses[size])
    })
  })

  it('applies custom className to the panel', () => {
    render(
      <Modal open onClose={() => {}} className="custom-panel">
        Body
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('custom-panel')
  })
})
