"use client";
import React from "react";
import AdBanner from "./AdBanner";

export type AdPosition =
  | "home-header"
  | "home-in-content"
  | "home-sidebar"
  | "home-sticky-bottom"
  | "calc-header"
  | "calc-in-content"
  | "calc-sidebar"
  | "calc-sticky-bottom";

export interface AdSlotProps {
  position: AdPosition;
  className?: string;
  adClient?: string; // e.g. NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID
  adSlot?: string;   // numeric slot id, configurable per placement
  fullWidthResponsive?: boolean;
}

function mapPositionToPlacement(position: AdPosition): "header" | "in-content" | "sidebar" | "sticky-bottom" {
  switch (position) {
    case "home-header":
    case "calc-header":
      return "header";
    case "home-in-content":
    case "calc-in-content":
      return "in-content";
    case "home-sidebar":
    case "calc-sidebar":
      return "sidebar";
    case "home-sticky-bottom":
    case "calc-sticky-bottom":
      return "sticky-bottom";
  }
}

const AdSlot: React.FC<AdSlotProps> = ({
  position,
  className,
  adClient,
  adSlot,
  fullWidthResponsive = true,
}) => {
  const placement = mapPositionToPlacement(position);

  return (
    <AdBanner
      placement={placement}
      className={className}
      adClient={adClient}
      adSlot={adSlot}
      fullWidthResponsive={fullWidthResponsive}
    />
  );
};

export default AdSlot;
