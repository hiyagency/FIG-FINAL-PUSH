import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        brand: {
          50: "#f5f7ff",
          100: "#e8eeff",
          200: "#c8d7ff",
          300: "#9ab7ff",
          400: "#678cff",
          500: "#4464ff",
          600: "#3147f0",
          700: "#2735d1",
          800: "#2230a7",
          900: "#1f2d84",
          950: "#171f52"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        soft: "0 24px 60px -28px rgba(15, 23, 42, 0.28)",
        panel: "0 24px 80px -40px rgba(8, 15, 34, 0.6)"
      },
      backgroundImage: {
        "grain-gradient":
          "radial-gradient(circle at top left, rgba(18, 112, 255, 0.12), transparent 40%), radial-gradient(circle at top right, rgba(10, 120, 106, 0.12), transparent 36%), linear-gradient(180deg, #f8fbff 0%, #f5f4ef 100%)",
        "aurora-shell":
          "radial-gradient(circle at 20% 0%, rgba(68, 100, 255, 0.18), transparent 30%), radial-gradient(circle at 80% 0%, rgba(21, 199, 172, 0.18), transparent 28%), linear-gradient(180deg, #081121 0%, #0d1830 42%, #f3f6fb 100%)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
