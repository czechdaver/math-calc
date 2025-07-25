import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a minimal root layout that just renders children
  // The actual HTML structure is handled by the locale-specific layout in [locale]/layout.tsx
  return children;
}
