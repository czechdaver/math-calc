/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    // BMI category colors - must be safelisted for dynamic assignment
    'text-blue-600', 'dark:text-blue-400',
    'text-green-600', 'dark:text-green-400',
    'text-yellow-600', 'dark:text-yellow-400',
    'text-red-600', 'dark:text-red-400',
    // Background variants for BMI scale display
    'bg-blue-50', 'dark:bg-blue-950',
    'bg-green-50', 'dark:bg-green-950',
    'bg-yellow-50', 'dark:bg-yellow-950',
    'bg-red-50', 'dark:bg-red-950',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Category Specific Colors
        finance: {
          primary: "#10b981", // emerald-500
          secondary: "#d1fae5", // emerald-100
          text: "#064e3b", // emerald-900
          gradient: "from-emerald-500/10 to-teal-500/10",
        },
        health: {
          primary: "#f43f5e", // rose-500
          secondary: "#ffe4e6", // rose-100
          text: "#881337", // rose-900
          gradient: "from-rose-500/10 to-pink-500/10",
        },
        math: {
          primary: "#6366f1", // indigo-500
          secondary: "#e0e7ff", // indigo-100
          text: "#312e81", // indigo-900
          gradient: "from-indigo-500/10 to-violet-500/10",
        },
        construction: {
          primary: "#f59e0b", // amber-500
          secondary: "#fef3c7", // amber-100
          text: "#78350f", // amber-900
          gradient: "from-amber-500/10 to-orange-500/10",
        },
        practical: {
          primary: "#64748b", // slate-500
          secondary: "#f1f5f9", // slate-100
          text: "#0f172a", // slate-900
          gradient: "from-slate-500/10 to-gray-500/10",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
