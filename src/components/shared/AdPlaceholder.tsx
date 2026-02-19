// src/components/shared/AdPlaceholder.tsx
import React from 'react';

import { useTranslations } from 'next-intl';

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
const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, className = '' }) => {
  const t = useTranslations();
  const [width, height] = size.includes('x') ? size.split('x') : ['auto', 'auto'];

  return (
    <div
      className={`bg-muted border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm ${className}`}
      style={{ minHeight: height !== 'auto' ? `${height}px` : '100px' }}
    >
      <span className="text-sm font-medium text-muted-foreground opacity-50">{t('common.ad_space') || 'Ad Space'} ({width}x{height})</span>
    </div>
  );
};

export default AdPlaceholder;
