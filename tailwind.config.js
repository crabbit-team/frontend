/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        neongreen: {
          DEFAULT: "hsl(var(--neongreen))",
          foreground: "hsl(var(--neongreen-foreground))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        "carrot-green": {
          DEFAULT: "hsl(var(--carrot-green))",
          foreground: "hsl(var(--carrot-green-foreground))",
        },
        "carrot-orange": {
          DEFAULT: "hsl(var(--carrot-orange))",
          foreground: "hsl(var(--carrot-orange-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        tech: ['"Rajdhani"', 'sans-serif'],
      },
    },
    // Override default Tailwind color palettes completely (not in extend)
    colors: {
      pink: {
        DEFAULT: "hsl(var(--pink))",
        foreground: "hsl(var(--pink-foreground))",
      },
      gray: {
        DEFAULT: "hsl(var(--gray))",
        foreground: "hsl(var(--gray-foreground))",
      },
    },
  },
  plugins: [],
}
