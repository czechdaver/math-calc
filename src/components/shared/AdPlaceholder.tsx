// src/components/shared/AdPlaceholder.tsx
import React from 'react';

export interface AdPlaceholderProps {
  size: string;
  position: string;
  className?: string;
}

/**
 * AdPlaceholder component for displaying ad spaces with different sizes.
 * Supports various ad sizes like 300x250, 160x600, 320x50, etc.
 *
 * @param size - Ad dimensions (e.g., "300x250", "160x600")
 * @param position - Position description (e.g., "Sidebar", "In-Content")
 * @param className - Additional CSS classes
 */
const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, position, className = '' }) => {
  return (
    <div
      className={`bg-muted border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm ${className}`}
      style={{ minHeight: size.includes('x') ? size.split('x')[1] + 'px' : '100px' }}
    >
      Ad Space ({size}) - {position}
    </div>
  );
};

export default AdPlaceholder;
