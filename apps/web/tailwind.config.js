/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--color-muted))",
          accent: "hsl(var(--color-muted-dark))",
        },
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          dark: "hsl(var(--color-primary-dark))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        foreground: "hsl(var(--color-foreground))",
        background: "hsl(var(--color-background))",
        muted: "hsl(var(--color-muted))",
      },
    },
  },
  plugins: [],
};
