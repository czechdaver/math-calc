import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink as ShadcnPaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationVariant = 'default' | 'outline' | 'ghost';
type PaginationSize = 'sm' | 'md' | 'lg';

interface PaginationProps {
  /**
   * Current page number (1-based)
   */
  currentPage: number;
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Number of items per page
   * @default 10
   */
  itemsPerPage?: number;
  /**
   * Number of page buttons to show before and after the current page
   * @default 1
   */
  siblingCount?: number;
  /**
   * Whether to show the first and last page buttons
   * @default true
   */
  showFirstLastButtons?: boolean;
  /**
   * Whether to show the previous and next buttons
   * @default true
   */
  showPrevNextButtons?: boolean;
  /**
   * Whether to show the page info text
   * @default true
   */
  showPageInfo?: boolean;
  /**
   * Whether to show the page size selector
   * @default false
   */
  showPageSizeSelector?: boolean;
  /**
   * Available page sizes
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Callback when the page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when the page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * The variant of the pagination
   * @default 'default'
   */
  variant?: PaginationVariant;
  /**
   * The size of the pagination
   * @default 'md'
   */
  size?: PaginationSize;
  /**
   * Additional class names for the pagination container
   */
  className?: string;
  /**
   * Additional class names for the pagination items
   */
  itemClassName?: string;
  /**
   * Additional class names for the active pagination item
   */
  activeItemClassName?: string;
  /**
   * Additional class names for the pagination info text
   */
  infoClassName?: string;
  /**
   * Additional class names for the page size selector
   */
  pageSizeClassName?: string;
  /**
   * Whether the pagination is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether to show ellipsis
   * @default true
   */
  showEllipsis?: boolean;
}

// Map our size prop to shadcn's size classes
const sizeClasses: Record<PaginationSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

// Map our variant prop to shadcn's variant classes
const variantClasses: Record<PaginationVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

/**
 * A flexible pagination component built on top of shadcn/ui's Pagination.
 * Provides a simple API with additional features like page size selection and info text.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  siblingCount = 1,
  showFirstLastButtons = true,
  showPrevNextButtons = true,
  showPageInfo = true,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  variant = 'default',
  size = 'md',
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  infoClassName = '',
  pageSizeClassName = '',
  disabled = false,
  showEllipsis = true,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const pageNumbers = React.useMemo(() => {
    const pages: (number | '...')[] = [];
    const totalPageNumbers = 5 + siblingCount * 2; // Show first, last, current, siblings, and ellipsis

    if (totalPages <= totalPageNumbers) {
      // If total pages is less than the maximum number of pages to show, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate left and right sibling indices
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      // Determine when to show ellipsis
      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Always show first page
      pages.push(1);

      // Show ellipsis or pages between first and current page
      if (shouldShowLeftEllipsis) {
        pages.push('...');
      } else {
        for (let i = 2; i < leftSiblingIndex; i++) {
          pages.push(i);
        }
      }

      // Show current page and siblings
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Show ellipsis or pages between current page and last page
      if (shouldShowRightEllipsis) {
        if (rightSiblingIndex < totalPages - 1) {
          pages.push('...');
        }
      } else {
        for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
          pages.push(i);
        }
      }

      // Always show last page if there's more than one page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, siblingCount]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) {
      return;
    }
    onPageChange(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // If there's only one page and we're not showing the page size selector, don't render anything
  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {showPageInfo && (
          <div className={cn('text-sm text-muted-foreground', infoClassName)}>
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
        )}
        
        {showPageSizeSelector && onPageSizeChange && (
          <div className={cn('flex items-center gap-2', pageSizeClassName)}>
            <label htmlFor="page-size" className="text-sm text-muted-foreground">
              Rows per page:
            </label>
            <select
              id="page-size"
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              disabled={disabled}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <ShadcnPagination>
        <PaginationContent>
          {showFirstLastButtons && (
            <PaginationItem className={itemClassName}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || disabled}
                className={cn(sizeClasses[size], 'rounded-md')}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </PaginationItem>
          )}
          
          {showPrevNextButtons && (
            <PaginationItem className={itemClassName}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || disabled}
                className={cn(sizeClasses[size], 'rounded-md')}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
            </PaginationItem>
          )}
          
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return showEllipsis ? (
                <PaginationItem key={`ellipsis-${index}`} className={itemClassName}>
                  <PaginationEllipsis className="h-10 w-10 p-0" />
                </PaginationItem>
              ) : null;
            }
            
            const isActive = page === currentPage;
            
            return (
              <PaginationItem key={page} className={itemClassName}>
                <Button
                  variant={isActive ? 'outline' : 'ghost'}
                  size="icon"
                  onClick={() => handlePageChange(page as number)}
                  disabled={disabled}
                  className={cn(
                    sizeClasses[size],
                    'rounded-md',
                    isActive ? variantClasses[variant] : '',
                    isActive ? activeItemClassName : ''
                  )}
                >
                  {page}
                </Button>
              </PaginationItem>
            );
          })}
          
          {showPrevNextButtons && (
            <PaginationItem className={itemClassName}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || disabled || totalPages === 0}
                className={cn(sizeClasses[size], 'rounded-md')}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </PaginationItem>
          )}
          
          {showFirstLastButtons && (
            <PaginationItem className={itemClassName}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || disabled || totalPages === 0}
                className={cn(sizeClasses[size], 'rounded-md')}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
};

export { Pagination };
export type { PaginationProps, PaginationVariant, PaginationSize };
