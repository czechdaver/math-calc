"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TableVariant = 'default' | 'striped' | 'bordered' | 'hover' | 'compact' | 'simple'
type TableSize = 'sm' | 'md' | 'lg'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * The variant of the table
   * @default 'default'
   */
  variant?: TableVariant
  /**
   * The size of the table
   * @default 'md'
   */
  size?: TableSize
  /**
   * Whether the table takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean
  /**
   * Whether the table has a border
   * @default true
   */
  border?: boolean
  /**
   * Whether to show a border around the table
   * @default true
   */
  borderAround?: boolean
  /**
   * Whether the table rows are hoverable
   * @default true
   */
  hoverable?: boolean
  /**
   * Additional class names for the table
   */
  className?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({
    variant = 'default',
    size = 'md',
    fullWidth = false,
    border = true,
    borderAround = true,
    hoverable = true,
    className = '',
    ...props
  }, ref) => {
    // Size classes
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    }

    // Variant classes
    const variantClasses = {
      default: '',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/20',
      bordered: 'border-separate border-spacing-0 [&_td]:border [&_th]:border',
      hover: '[&_tbody_tr:hover]:bg-muted/30',
      compact: 'text-xs [&_td]:p-1 [&_th]:p-1',
      simple: '[&_td]:border-b [&_th]:border-b [&_td]:border-t-0 [&_th]:border-t-0',
    }

    const tableClasses = cn(
      'w-full caption-bottom',
      sizeClasses[size],
      variantClasses[variant],
      {
        'w-full': fullWidth,
        'border-collapse': border,
        'border border-border rounded-lg overflow-hidden': border && borderAround,
      },
      className
    )

    return (
      <div className="relative w-full overflow-x-auto">
        <table
          ref={ref}
          className={tableClasses}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = 'Table'

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Whether the header has a bottom border
   * @default true
   */
  border?: boolean
  /**
   * Additional class names for the table header
   */
  className?: string
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, border = true, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        data-slot="table-header"
        className={cn(
          {
            '[&_tr]:border-b': border,
            'bg-muted/50': border,
          },
          className
        )}
        {...props}
      />
    )
  }
)
TableHeader.displayName = 'TableHeader'

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Whether to show a loading state
   * @default false
   */
  loading?: boolean
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode
  /**
   * Number of skeleton rows to show when loading
   * @default 5
   */
  skeletonRows?: number
  /**
   * Number of columns to show in skeleton
   * @default 4
   */
  skeletonColumns?: number
  /**
   * Additional class names for the table body
   */
  className?: string
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({
    className,
    loading = false,
    loadingComponent,
    skeletonRows = 5,
    skeletonColumns = 4,
    children,
    ...props
  }, ref) => {
    if (loading) {
      return (
        <tbody ref={ref} className={cn("animate-pulse", className)} {...props}>
          {loadingComponent || (
            <>
              {[...Array(skeletonRows)].map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`}>
                  {[...Array(skeletonColumns)].map((_, colIndex) => (
                    <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="p-2">
                      <div className="h-4 bg-muted rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      )
    }

    return (
      <tbody
        ref={ref}
        data-slot="table-body"
        className={cn(
          "[&_tr:last-child]:border-0",
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = 'TableBody'

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Whether the footer has a top border
   * @default true
   */
  border?: boolean
  /**
   * Additional class names for the table footer
   */
  className?: string
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, border = true, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        data-slot="table-footer"
        className={cn(
          "bg-muted/50 font-medium [&>tr]:last:border-b-0",
          {
            'border-t': border,
          },
          className
        )}
        {...props}
      />
    )
  }
)
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Whether the row is selected
   * @default false
   */
  selected?: boolean
  /**
   * Whether the row is clickable
   * @default false
   */
  clickable?: boolean
  /**
   * Whether to show a hover effect
   * @default true
   */
  hoverable?: boolean
  /**
   * Whether the row has a border
   * @default true
   */
  border?: boolean
  /**
   * Additional class names for the table row
   */
  className?: string
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({
    className,
    selected = false,
    clickable = false,
    hoverable = true,
    border = true,
    ...props
  }, ref) => {
    return (
      <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
          "transition-colors",
          {
            'border-b': border,
            'hover:bg-muted/50': hoverable && !selected,
            'bg-muted/30': selected,
            'cursor-pointer': clickable,
          },
          className
        )}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Whether the header cell is sortable
   * @default false
   */
  sortable?: boolean
  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc' | false
  /**
   * Callback when sort is requested
   */
  onSort?: (event: React.MouseEvent<HTMLTableCellElement>) => void
  /**
   * Additional class names for the table head cell
   */
  className?: string
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({
    className,
    sortable = false,
    sortDirection,
    onClick,
    onSort,
    ...props
  }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (onClick) {
        onClick(event)
      }
      if (sortable && onSort) {
        onSort(event)
      }
    }

    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          "h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
          "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          {
            'cursor-pointer select-none': sortable,
            'hover:bg-muted/20': sortable,
          },
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex items-center">
          {props.children}
          {sortable && (
            <span className="ml-2">
              {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '⇅'}
            </span>
          )}
        </div>
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Whether the cell is a header cell
   * @default false
   */
  header?: boolean
  /**
   * How to align the cell content
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'
  /**
   * Whether the cell is selected
   * @default false
   */
  selected?: boolean
  /**
   * Additional class names for the table cell
   */
  className?: string
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({
    className,
    header = false,
    align = 'left',
    selected = false,
    ...props
  }, ref) => {
    const Component = header ? 'th' : 'td'
    
    return (
      <Component
        ref={ref}
        data-slot="table-cell"
        className={cn(
          "p-2 align-middle whitespace-nowrap",
          "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          {
            'text-left': align === 'left',
            'text-center': align === 'center',
            'text-right': align === 'right',
            'font-medium': header,
            'bg-muted/30': selected,
          },
          className
        )}
        {...props}
      />
    )
  }
)
TableCell.displayName = 'TableCell'

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  /**
   * Additional class names for the table caption
   */
  className?: string
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        data-slot="table-caption"
        className={cn("text-muted-foreground mt-4 text-sm", className)}
        {...props}
      />
    )
  }
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
