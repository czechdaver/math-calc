"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UnitSet = "metric" | "imperial_us" | "imperial_uk";

export type DerivedUnits = {
  length: "mm" | "cm" | "m" | "in" | "ft";
  weight: "g" | "kg" | "lb";
  temperature: "C" | "F";
  distance: "km" | "mi";
  volume: "ml" | "l" | "fl_oz" | "gal_us" | "gal_uk";
};

export type UnitsPreference = {
  unitSet: UnitSet;
  manualOverride: boolean;
};

type UnitsContextType = {
  preference: UnitsPreference;
  setUnitSet: (set: UnitSet) => void;
  setAutoDetect: () => void;
  units: DerivedUnits;
};

const DEFAULT_PREFERENCE: UnitsPreference = {
  unitSet: "metric",
  manualOverride: false,
};

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

// Mapping region -> unit set
const REGION_TO_UNITSET: Record<string, UnitSet> = {
  US: "imperial_us",
  GB: "imperial_uk",
  // US territories
  PR: "imperial_us",
  GU: "imperial_us",
  VI: "imperial_us",
  AS: "imperial_us",
  MP: "imperial_us",
};

function getUnitsForSet(unitSet: UnitSet): DerivedUnits {
  switch (unitSet) {
    case "imperial_us":
      return {
        length: "in",
        weight: "lb",
        temperature: "F",
        distance: "mi",
        volume: "gal_us",
      };
    case "imperial_uk":
      // UK commonly uses metric for most things, but miles for distance, imperial pints/gallons in contexts.
      return {
        length: "cm",
        weight: "kg",
        temperature: "C",
        distance: "mi",
        volume: "gal_uk",
      };
    case "metric":
    default:
      return {
        length: "cm",
        weight: "kg",
        temperature: "C",
        distance: "km",
        volume: "l",
      };
  }
}

function parseRegion(code: string | undefined): string | undefined {
  if (!code) return undefined;
  // Accept formats like en-US, en_US, cs, sk-SK
  const match = code.replace("_", "-").split("-");
  if (match.length >= 2) return match[1].toUpperCase();
  return undefined;
}

function detectFromBrowserLanguages(langs: readonly string[] | undefined, fallbackLocale: string): UnitSet {
  const list = (langs && langs.length > 0 ? langs : [fallbackLocale]) as string[];
  for (const lang of list) {
    const region = parseRegion(lang);
    if (region) {
      const set = REGION_TO_UNITSET[region];
      if (set) return set;
    }
    // Special-case entire language where appropriate
    const lower = lang.toLowerCase();
    if (lower.startsWith("en-us")) return "imperial_us";
    if (lower.startsWith("en-gb")) return "imperial_uk";
  }
  // Defaults by app locale
  const appLocale = (fallbackLocale || "en").toLowerCase();
  if (appLocale.startsWith("cs") || appLocale.startsWith("sk") || appLocale.startsWith("pl") || appLocale.startsWith("hu")) {
    return "metric";
  }
  if (appLocale.startsWith("en")) {
    // Requirement: default to British units for English when unknown
    return "imperial_uk";
  }
  return "metric";
}

const STORAGE_KEY = "mc.units.preference.v1";

export function UnitsProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const [preference, setPreference] = useState<UnitsPreference>(DEFAULT_PREFERENCE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as UnitsPreference;
        if (parsed && parsed.unitSet) {
          setPreference(parsed);
          return;
        }
      }
    } catch {}

    // No saved preference: detect
    const detected = typeof window !== "undefined" ? detectFromBrowserLanguages(window.navigator.languages, locale) : detectFromBrowserLanguages(undefined, locale);
    setPreference({ unitSet: detected, manualOverride: false });
  }, [locale]);

  // Persist when preference changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
      }
    } catch {}
  }, [preference]);

  const units = useMemo(() => getUnitsForSet(preference.unitSet), [preference.unitSet]);

  const value: UnitsContextType = useMemo(
    () => ({
      preference,
      setUnitSet: (set: UnitSet) => setPreference({ unitSet: set, manualOverride: true }),
      setAutoDetect: () => {
        const detected = typeof window !== "undefined" ? detectFromBrowserLanguages(window.navigator.languages, locale) : detectFromBrowserLanguages(undefined, locale);
        setPreference({ unitSet: detected, manualOverride: false });
      },
      units,
    }),
    [preference, units, locale]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error("useUnits must be used within UnitsProvider");
  return ctx;
}
