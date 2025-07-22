import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from '@/components/ui/tabs';

type TabVariant = 'default' | 'pills' | 'underline' | 'segmented';
type TabSize = 'sm' | 'md' | 'lg';

interface TabItemProps {
  /**
   * The label to display for the tab
   */
  label: React.ReactNode;
  /**
   * The content to display when the tab is active
   */
  children: React.ReactNode;
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode;
  /**
   * Optional badge to display after the label
   */
  badge?: React.ReactNode;
  /**
   * Additional class names for the tab panel
   */
  panelClassName?: string;
  /**
   * Additional class names for the tab button
   */
  className?: string;
  /**
   * Tab ID (automatically set if not provided)
   * @private
   */
  _id?: string;
  /**
   * Whether the tab is active
   * @private
   */
  _isActive?: boolean;
  /**
   * Tab click handler
   * @private
   */
  _onTabClick?: (id: string) => void;
}

interface TabsProps {
  /**
   * The active tab ID
   */
  activeTab?: string;
  /**
   * Callback when the active tab changes
   */
  onChange?: (tabId: string) => void;
  /**
   * The tab variant
   * @default 'default'
   */
  variant?: TabVariant;
  /**
   * The size of the tabs
   * @default 'md'
   */
  size?: TabSize;
  /**
   * Whether to fill the available width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Additional class names for the tabs container
   */
  className?: string;
  /**
   * Additional class names for the tab list
   */
  tabListClassName?: string;
  /**
   * Additional class names for the tab panels container
   */
  panelsClassName?: string;
  /**
   * The tab items
   */
  children: React.ReactNode;
  /**
   * Optional header content to display above the tabs
   */
  header?: React.ReactNode;
  /**
   * Optional footer content to display below the panels
   */
  footer?: React.ReactNode;
  /**
   * Whether to keep inactive tab panels mounted
   * @default false
   */
  keepMounted?: boolean;
}

// Map our size prop to shadcn's size classes
const sizeClasses: Record<TabSize, string> = {
  sm: 'h-7 text-xs px-2',
  md: 'h-9 text-sm px-3',
  lg: 'h-11 text-base px-4',
};

// Map our variant prop to shadcn's variant classes
const variantClasses: Record<TabVariant, { list: string; trigger: string }> = {
  default: {
    list: 'bg-muted text-muted-foreground p-1 rounded-md',
    trigger: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  },
  pills: {
    list: 'space-x-1',
    trigger: 'rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
  },
  underline: {
    list: 'border-b',
    trigger: 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground',
  },
  segmented: {
    list: 'bg-muted p-1 rounded-lg',
    trigger: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  },
};

/**
 * A single tab item component
 */
const TabItem: React.FC<TabItemProps> = ({
  label,
  children,
  disabled = false,
  icon,
  badge,
  panelClassName = '',
  className = '',
  _id = '',
  _isActive = false,
  _onTabClick,
}) => {
  return (
    <>
      <ShadcnTabsTrigger
        value={_id}
        disabled={disabled}
        onClick={() => _onTabClick?.(_id)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {badge && <span className="ml-2">{badge}</span>}
      </ShadcnTabsTrigger>
      <ShadcnTabsContent value={_id} className={panelClassName}>
        {children}
      </ShadcnTabsContent>
    </>
  );
};

/**
 * Tabs component that provides a tabbed interface
 */
const Tabs: React.FC<TabsProps> & { Item: typeof TabItem } = ({
  activeTab: externalActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  tabListClassName = '',
  panelsClassName = '',
  children,
  header,
  footer,
  keepMounted = false,
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState<string>('');
  
  // Generate IDs for tabs if not provided
  const tabs = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;
    return {
      ...child.props,
      _id: child.props._id || `tab-${index}`,
    };
  }).filter(Boolean) as Array<TabItemProps & { _id: string }>;

  // Set the first tab as active by default if none is active
  React.useEffect(() => {
    if (tabs.length > 0 && !internalActiveTab && !externalActiveTab) {
      const firstEnabledTab = tabs.find(tab => !tab.disabled);
      if (firstEnabledTab) {
        setInternalActiveTab(firstEnabledTab._id);
      }
    }
  }, [tabs, internalActiveTab, externalActiveTab]);

  const activeTab = externalActiveTab || internalActiveTab;

  const handleTabChange = (value: string) => {
    if (value !== activeTab) {
      setInternalActiveTab(value);
      onChange?.(value);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {header && <div className="mb-4">{header}</div>}
      
      <ShadcnTabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <ShadcnTabsList 
          className={cn(
            'inline-flex w-full' + (fullWidth ? ' w-full' : ' w-auto'),
            variantClasses[variant].list,
            tabListClassName
          )}
        >
          {tabs.map((tab) => (
            <TabItem
              key={tab._id}
              {...tab}
              _isActive={tab._id === activeTab}
              _onTabClick={handleTabChange}
              className={cn(
                sizeClasses[size],
                variantClasses[variant].trigger,
                fullWidth ? 'flex-1' : '',
                tab.className
              )}
            />
          ))}
        </ShadcnTabsList>
        
        {tabs.map((tab) => (
          <ShadcnTabsContent 
            key={`content-${tab._id}`} 
            value={tab._id}
            className={cn(panelsClassName, tab.panelClassName)}
            forceMount={keepMounted ? true : undefined}
          >
            {tab.children}
          </ShadcnTabsContent>
        ))}
      </ShadcnTabs>
      
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

// Add Item as a static property to Tabs
Tabs.Item = TabItem;

export default Tabs;
export type { TabVariant, TabSize, TabItemProps, TabsProps };
