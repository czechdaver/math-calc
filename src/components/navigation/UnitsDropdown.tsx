'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useUnits, UnitSet } from '@/contexts/UnitsContext';
import { createPortal } from 'react-dom';

type Props = {
  className?: string;
};

const UnitsDropdown: React.FC<Props> = ({ className }) => {
  const t = useTranslations();
  const { preference, setUnitSet, setAutoDetect } = useUnits();
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number; width: number }>({ top: 0, right: 0, width: 0 });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.units-dropdown')) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute fixed position for portaled menu (like Radix Portal)
  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        width: rect.width,
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isOpen]);

  const labelForSet = (set: UnitSet) => {
    switch (set) {
      case 'metric':
        return t('units_metric');
      case 'imperial_uk':
        return t('units_imperial_uk');
      case 'imperial_us':
        return t('units_imperial_us');
      default:
        return t('units_metric');
    }
  };

  const currentLabel = useMemo(() => {
    return preference.manualOverride ? labelForSet(preference.unitSet) : t('units_auto');
  }, [preference, t]);

  const handleSelect = (set: UnitSet) => {
    setUnitSet(set);
    setIsOpen(false);
  };

  const handleAuto = () => {
    setAutoDetect();
    setIsOpen(false);
  };

  return (
    <div className={`relative ml-2 units-dropdown ${className ?? ''}`}>
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 
          bg-white border border-gray-200 rounded-lg shadow-sm
          hover:bg-gray-50 hover:border-gray-300 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('units')}
      >
        <span className="hidden lg:inline">{t('units')}</span>
        <span className="lg:text-gray-500 lg:ml-1">{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        (
          <div
            className="units-dropdown fixed z-[60]"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <div
              className="max-h-[50vh] glass-dropdown rounded-lg animate-in slide-in-from-top-2 origin-top-right overflow-y-auto"
              style={{ width: menuPos.width }}
            >
              <div className="py-1">
                <button
                  onClick={handleAuto}
                  className={`
                    w-full text-left px-4 py-2 text-sm flex items-center gap-3
                    transition-all duration-150 hover:bg-blue-50/80
                    ${!preference.manualOverride ? 'bg-blue-50/90 text-blue-700 shadow-sm' : 'text-gray-700 hover:text-blue-600'}
                  `}
                >
                  {t('units_auto')}
                  {!preference.manualOverride && <Check className="ml-auto w-4 h-4 text-blue-700" />}
                </button>

                <div className="my-1 h-px bg-gray-100" />

                {(['metric', 'imperial_uk', 'imperial_us'] as UnitSet[]).map((set) => {
                  const selected = preference.manualOverride && preference.unitSet === set;
                  return (
                    <button
                      key={set}
                      onClick={() => handleSelect(set)}
                      className={`
                        w-full text-left px-4 py-2 text-sm flex items-center gap-3
                        transition-all duration-150 hover:bg-blue-50/80
                        ${selected ? 'bg-blue-50/90 text-blue-700 shadow-sm' : 'text-gray-700 hover:text-blue-600'}
                      `}
                    >
                      {labelForSet(set)}
                      {selected && <Check className="ml-auto w-4 h-4 text-blue-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default UnitsDropdown;
