"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';

type ModalVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  /** Whether the modal is visible. Component renders nothing when false. */
  open: boolean;
  /** Called when the user dismisses the modal (ESC, backdrop click, close button). */
  onClose: () => void;
  /** Visible heading rendered in the modal header. */
  title?: React.ReactNode;
  /** Optional description text rendered under the title. */
  description?: React.ReactNode;
  /** Body content. */
  children?: React.ReactNode;
  /** Footer area (typically action buttons). */
  footer?: React.ReactNode;
  /** Accent variant applied to the header strip & close button. */
  variant?: ModalVariant;
  /** Width token. Defaults to `md`. */
  size?: ModalSize;
  /** Hide the default close (×) button in the top-right. */
  hideCloseButton?: boolean;
  /** Disable dismissal via backdrop click. ESC and the close button still work. */
  disableBackdropClose?: boolean;
  /** Disable dismissal via the ESC key. Backdrop click and close button still work. */
  disableEscapeClose?: boolean;
  /** Extra classes for the modal panel. */
  className?: string;
  /** Extra classes for the backdrop. */
  backdropClassName?: string;
}

// Accent map. Each variant tints the header strip, the title text, and the
// ring that pulses when the modal opens.
const variantStyles: Record<
  ModalVariant,
  { ring: string; title: string; strip: string; close: string; closeHover: string }
> = {
  primary: {
    ring: 'ring-primary/40',
    title: 'text-primary',
    strip: 'bg-primary',
    close: 'text-primary',
    closeHover: 'hover:bg-primary/10',
  },
  secondary: {
    ring: 'ring-secondary/40',
    title: 'text-secondary',
    strip: 'bg-secondary',
    close: 'text-secondary',
    closeHover: 'hover:bg-secondary/10',
  },
  success: {
    ring: 'ring-success/40',
    title: 'text-success',
    strip: 'bg-success',
    close: 'text-success',
    closeHover: 'hover:bg-success/10',
  },
  danger: {
    ring: 'ring-danger/40',
    title: 'text-danger',
    strip: 'bg-danger',
    close: 'text-danger',
    closeHover: 'hover:bg-danger/10',
  },
  warning: {
    ring: 'ring-warning/40',
    title: 'text-warning',
    strip: 'bg-warning',
    close: 'text-warning',
    closeHover: 'hover:bg-warning/10',
  },
};

// Width tokens. Kept narrow so the modal reads as a focused card, not a page.
const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

// Selectors for elements that count as "focusable". Used by the focus trap
// so Tab/Shift+Tab stays inside the modal while it's open.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'primary',
  size = 'md',
  hideCloseButton = false,
  disableBackdropClose = false,
  disableEscapeClose = false,
  className = '',
  backdropClassName = '',
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()

  const panelRef = useRef<HTMLDivElement | null>(null)
  // Track the element that had focus when the modal opened so we can restore
  // it on close. Without this, focus drops back to <body> and screen reader
  // users lose their place in the page.
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // ESC key dismisses the modal unless explicitly disabled. Listener is
  // attached to document so it works regardless of which child has focus.
  useEffect(() => {
    if (!open || disableEscapeClose) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, disableEscapeClose, handleClose])

  // Lock body scroll while the modal is open so the page behind doesn't
  // move. We compensate for the disappearing scrollbar with padding-right
  // so layout doesn't shift on desktop.
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [open])

  // Focus management: on open, remember the previously focused element and
  // move focus into the modal. On close, restore the prior focus.
  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current =
      (document.activeElement as HTMLElement | null) ?? null

    // Defer to the next frame so the panel has mounted.
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return

      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      const first = focusables[0]
      if (first) {
        first.focus()
      } else {
        panel.focus()
      }
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      const previouslyFocused = previouslyFocusedRef.current
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
      previouslyFocusedRef.current = null
    }
  }, [open])

  // Focus trap: keep Tab and Shift+Tab cycling within the modal panel.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return

    const panel = panelRef.current
    if (!panel) return

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    )
    if (focusables.length === 0) {
      // Nothing to focus — hold focus on the panel itself.
      e.preventDefault()
      panel.focus()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (e.shiftKey) {
      if (active === first || !panel.contains(active)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (active === last || !panel.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!open) return null

  const v = variantStyles[variant]

  const backdropClasses = [
    // Full-viewport fixed layer with a semi-transparent dark backdrop.
    'fixed inset-0 z-50',
    'flex items-center justify-center',
    'p-4',
    // Semi-transparent overlay. Black/60 works on light & dark surfaces and
    // lets the page bleed through enough to keep context.
    'bg-black/60 backdrop-blur-sm',
    // Fade in for a soft entrance.
    'animate-[fadeIn_150ms_ease-out]',
    backdropClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const panelClasses = [
    'relative',
    'w-full',
    sizeStyles[size],
    // Card surface: solid background that contrasts against the dimmed page.
    'bg-surface text-foreground',
    'rounded-2xl shadow-2xl',
    // Thin border for definition on light themes (invisible on dark).
    'border border-border',
    // Accent ring pulses on entry to draw the eye to the modal.
    `ring-2 ${v.ring}`,
    // Pop-in entrance.
    'animate-[popIn_180ms_cubic-bezier(0.16,1,0.3,1)]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={backdropClasses}
      onMouseDown={(e) => {
        // Only close when the mousedown started outside the panel — this
        // avoids closing when the user clicks inside the modal and drags out.
        if (disableBackdropClose) return
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={panelClasses}
        onKeyDown={handleKeyDown}
      >
        {/* Coloured accent strip across the top. Small visual cue that
            carries the variant colour without overwhelming the panel. */}
        <div className={`h-1 w-full rounded-t-2xl ${v.strip}`} aria-hidden="true" />

        {/* Header: title + optional description + close button. */}
        {(title || description || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5">
            <div className="min-w-0 flex-1">
              {title && (
                <h2
                  id={titleId}
                  className={`text-lg font-semibold leading-tight ${v.title}`}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm text-muted"
                >
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className={[
                  'shrink-0',
                  'inline-flex h-8 w-8 items-center justify-center',
                  'rounded-full',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface',
                  v.close,
                  v.closeHover,
                ].join(' ')}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 text-sm leading-relaxed text-foreground">
          {children}
        </div>

        {/* Footer (action row) */}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
