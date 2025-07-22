import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion as ShadcnAccordion,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
  AccordionContent as ShadcnAccordionContent,
} from '@/components/ui/accordion';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

type AccordionVariant = 'default' | 'bordered' | 'filled' | 'separated';
type AccordionSize = 'sm' | 'md' | 'lg';

interface AccordionItemProps {
  /**
   * The title of the accordion item
   */
  title: React.ReactNode;
  /**
   * The content of the accordion item
   */
  children: React.ReactNode;
  /**
   * Whether the accordion item is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the accordion item is open by default
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Additional class names for the accordion item
   */
  className?: string;
  /**
   * Additional class names for the accordion header
   */
  headerClassName?: string;
  /**
   * Additional class names for the accordion content
   */
  contentClassName?: string;
  /**
   * Whether to show a chevron icon
   * @default true
   */
  showChevron?: boolean;
  /**
   * Custom icon to display when the accordion is closed
   */
  iconClosed?: React.ReactNode;
  /**
   * Custom icon to display when the accordion is open
   */
  iconOpened?: React.ReactNode;
  /**
   * Callback when the accordion item is opened
   */
  onOpen?: () => void;
  /**
   * Callback when the accordion item is closed
   */
  onClose?: () => void;
  /**
   * Unique identifier for the accordion item
   * @private
   */
  _id?: string;
  /**
   * Whether the accordion item is active
   * @private
   */
  _isActive?: boolean;
  /**
   * Callback when the accordion item is toggled
   * @private
   */
  _onToggle?: (id: string) => void;
  /**
   * Whether multiple items can be open at once
   * @private
   */
  _allowMultiple?: boolean;
  /**
   * The variant of the accordion
   * @private
   */
  _variant?: AccordionVariant;
  /**
   * The size of the accordion
   * @private
   */
  _size?: AccordionSize;
}

interface AccordionProps {
  /**
   * The active item ID or array of IDs (controlled mode)
   */
  activeItems?: string | string[];
  /**
   * Callback when the active items change (controlled mode)
   */
  onChange?: (activeItems: string[]) => void;
  /**
   * Whether multiple items can be open at once
   * @default false
   */
  allowMultiple?: boolean;
  /**
   * The visual style variant
   * @default 'default'
   */
  variant?: AccordionVariant;
  /**
   * The size of the accordion items
   * @default 'md'
   */
  size?: AccordionSize;
  /**
   * Additional class names for the accordion container
   */
  className?: string;
  /**
   * The accordion items
   */
  children: React.ReactNode;
  /**
   * Whether to show a chevron icon
   * @default true
   */
  showChevron?: boolean;
  /**
   * Custom icon to display when an accordion is closed
   */
  iconClosed?: React.ReactNode;
  /**
   * Custom icon to display when an accordion is open
   */
  iconOpened?: React.ReactNode;
  /**
   * Whether to show a divider between accordion items
   * @default true
   */
  showDivider?: boolean;
  /**
   * Whether to animate the accordion content
   * @default true
   */
  animate?: boolean;
}

// Map our size prop to shadcn's size classes
const sizeClasses: Record<AccordionSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

// Map our variant prop to shadcn's variant classes
const variantClasses: Record<AccordionVariant, { item: string; trigger: string; content: string }> = {
  default: {
    item: 'border-b',
    trigger: 'hover:bg-accent hover:text-accent-foreground',
    content: 'pt-0 pb-4',
  },
  bordered: {
    item: 'border rounded-md mb-2 last:mb-0',
    trigger: 'px-4 hover:bg-accent hover:text-accent-foreground',
    content: 'px-4 pb-4',
  },
  filled: {
    item: 'bg-accent/30 rounded-md mb-2 last:mb-0',
    trigger: 'px-4 hover:bg-accent/50',
    content: 'px-4 pb-4',
  },
  separated: {
    item: 'border-b last:border-b-0',
    trigger: 'hover:bg-accent hover:text-accent-foreground',
    content: 'pt-0 pb-4',
  },
};

/**
 * A single accordion item component
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  disabled = false,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  showChevron = true,
  iconClosed = <ChevronDown className="h-4 w-4" />,
  iconOpened = <ChevronUp className="h-4 w-4" />,
  onOpen,
  onClose,
  _id = '',
  _isActive = false,
  _onToggle,
  _allowMultiple = false,
  _variant = 'default',
  _size = 'md',
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const isControlled = _onToggle !== undefined;
  const isActive = isControlled ? _isActive : isOpen;

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isControlled) {
      setIsOpen(!isActive);
      if (!isActive && onOpen) onOpen();
      if (isActive && onClose) onClose();
    } else if (_onToggle) {
      _onToggle(_id);
    }
  };

  return (
    <ShadcnAccordionItem 
      value={_id}
      disabled={disabled}
      className={cn(
        variantClasses[_variant].item,
        _variant === 'separated' && 'py-2',
        className
      )}
    >
      <ShadcnAccordionTrigger
        onClick={handleToggle}
        className={cn(
          'w-full text-left font-medium transition-colors',
          sizeClasses[_size],
          variantClasses[_variant].trigger,
          _variant !== 'separated' && 'py-4',
          disabled && 'opacity-50 cursor-not-allowed',
          headerClassName
        )}
      >
        <div className="flex-1">{title}</div>
        {showChevron && (
          <span className="ml-2">
            {isActive ? (iconOpened || <ChevronUp className="h-4 w-4" />) : (iconClosed || <ChevronDown className="h-4 w-4" />)}
          </span>
        )}
      </ShadcnAccordionTrigger>
      <ShadcnAccordionContent className={cn(
        variantClasses[_variant].content,
        contentClassName
      )}>
        {children}
      </ShadcnAccordionContent>
    </ShadcnAccordionItem>
  );
};

/**
 * Accordion component that provides a collapsible content area
 */
const Accordion: React.FC<AccordionProps> & { Item: typeof AccordionItem } = ({
  activeItems: externalActiveItems,
  onChange,
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  showChevron = true,
  iconClosed,
  iconOpened,
  showDivider = true,
  animate = true,
}) => {
  const [internalActiveItems, setInternalActiveItems] = React.useState<string[]>([]);
  const isControlled = externalActiveItems !== undefined;
  const activeItems = isControlled 
    ? Array.isArray(externalActiveItems) 
      ? externalActiveItems 
      : [externalActiveItems]
    : internalActiveItems;

  // Generate IDs for accordion items if not provided
  const items = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;
    return {
      ...child.props,
      _id: child.props._id || `accordion-item-${index}`,
    };
  }).filter(Boolean) as Array<AccordionItemProps & { _id: string }>;

  // Set the first item as active by default if none is active and not controlled
  React.useEffect(() => {
    if (!isControlled && items.length > 0 && activeItems.length === 0) {
      const firstEnabledItem = items.find(item => !item.disabled && item.defaultOpen);
      if (firstEnabledItem) {
        setInternalActiveItems([firstEnabledItem._id]);
      }
    }
  }, [items, activeItems, isControlled]);

  const handleToggle = (id: string) => {
    let newActiveItems: string[] = [];
    
    if (allowMultiple) {
      if (activeItems.includes(id)) {
        newActiveItems = activeItems.filter(itemId => itemId !== id);
      } else {
        newActiveItems = [...activeItems, id];
      }
    } else {
      newActiveItems = activeItems.includes(id) ? [] : [id];
    }

    if (!isControlled) {
      setInternalActiveItems(newActiveItems);
    }
    
    if (onChange) {
      onChange(allowMultiple ? newActiveItems : newActiveItems[0] || '');
    }
  };

  return (
    <ShadcnAccordion 
      type={allowMultiple ? 'multiple' : 'single'} 
      value={allowMultiple ? activeItems : activeItems[0] || ''}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item._id}
          {...item}
          _id={item._id}
          _isActive={activeItems.includes(item._id)}
          _onToggle={handleToggle}
          _allowMultiple={allowMultiple}
          _variant={variant}
          _size={size}
          showChevron={item.showChevron !== undefined ? item.showChevron : showChevron}
          iconClosed={item.iconClosed !== undefined ? item.iconClosed : iconClosed}
          iconOpened={item.iconOpened !== undefined ? item.iconOpened : iconOpened}
        />
      ))}
    </ShadcnAccordion>
  );
};

// Add Item as a static property to Accordion
Accordion.Item = AccordionItem;

export default Accordion;
export type { AccordionVariant, AccordionSize, AccordionItemProps, AccordionProps };
