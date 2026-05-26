/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
          light: "#8b5cf6",
        },
        secondary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        card: "rgba(255, 255, 255, 0.03)",
        cardBorder: "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
      },
    },
  },
  plugins: [],
}
