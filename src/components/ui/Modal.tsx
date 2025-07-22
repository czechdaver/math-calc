import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';
type ModalVariant = 'default' | 'centered' | 'fullscreen' | 'bottom-sheet';

// Size classes for different modal sizes
const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-4xl',
  xl: 'sm:max-w-6xl',
  full: 'sm:max-w-[95vw]',
  auto: 'sm:max-w-fit',
};

// Variant classes for different modal variants
const variantClasses: Record<ModalVariant, string> = {
  default: '',
  centered: 'items-center',
  fullscreen: 'sm:max-w-[95vw] sm:max-h-[95vh] sm:rounded-lg',
  'bottom-sheet': 'sm:max-w-full sm:rounded-t-2xl sm:rounded-b-none sm:bottom-0 sm:top-auto sm:translate-y-0 sm:m-0',
};

// Modal variant specific classes
const modalVariantClasses: Record<ModalVariant, string> = {
  default: 'rounded-lg',
  centered: 'rounded-lg',
  fullscreen: 'h-[95vh] w-[95vw] m-0 rounded-lg',
  'bottom-sheet': 'w-full rounded-t-2xl',
};

interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title?: React.ReactNode;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Footer content (buttons, etc.)
   */
  footer?: React.ReactNode;
  /**
   * Size of the modal
   * @default 'md'
   */
  size?: ModalSize;
  /**
   * Variant of the modal
   * @default 'default'
   */
  variant?: ModalVariant;
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the modal when clicking the overlay
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether to close the modal when pressing the escape key
   * @default true
   */
  closeOnEsc?: boolean;
  /**
   * Additional class names for the modal
   */
  className?: string;
  /**
   * Additional class names for the modal content
   */
  contentClassName?: string;
  /**
   * Additional class names for the overlay
   */
  overlayClassName?: string;
  /**
   * Additional class names for the header
   */
  headerClassName?: string;
  /**
   * Additional class names for the body
   */
  bodyClassName?: string;
  /**
   * Additional class names for the footer
   */
  footerClassName?: string;
  /**
   * Whether to lock body scroll when modal is open
   * @default true
   */
  lockScroll?: boolean;
  /**
   * Initial focus ref for the modal
   */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /**
   * Whether to hide the overlay
   * @default false
   */
  hideOverlay?: boolean;
  /**
   * ARIA label for the modal
   */
  'aria-label'?: string;
  /**
   * ARIA describedby for the modal
   */
  'aria-describedby'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
  contentClassName = '',
  overlayClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  lockScroll = true,
  initialFocusRef,
  hideOverlay = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  // Lock body scroll when modal is open
  useLockBodyScroll(isOpen && lockScroll);

  // Handle overlay click
  const handlePointerDownOutside = (event: Event) => {
    if (!closeOnOverlayClick) {
      event.preventDefault();
    }
    return false;
  };

  // Handle escape key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !closeOnEsc) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Handle dialog open change
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Render the modal content
  const renderContent = () => (
    <>
      {(title || showCloseButton) && (
        <DialogHeader className={cn('flex flex-row items-center justify-between', headerClassName)}>
          {title && (
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          )}
          {showCloseButton && (
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          )}
        </DialogHeader>
      )}

      <div className={cn('py-4', bodyClassName)}>
        {children}
      </div>

      {footer && (
        <DialogFooter className={cn('flex items-center justify-end space-x-2', footerClassName)}>
          {footer}
        </DialogFooter>
      )}
    </>
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'bg-background shadow-lg sm:rounded-lg',
          sizeClasses[size],
          variantClasses[variant],
          modalVariantClasses[variant],
          className
        )}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={!closeOnEsc ? (e) => e.preventDefault() : undefined}
        style={{
          ...(variant === 'fullscreen' && {
            height: '95vh',
            width: '95vw',
            maxWidth: 'none',
          }),
          ...(variant === 'bottom-sheet' && {
            top: 'auto',
            bottom: 0,
            transform: 'translate(-50%, 0)',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
        }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

// Hook for managing modal state
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default Modal;
