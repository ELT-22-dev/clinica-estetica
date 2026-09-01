import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F2EC",
        ink: "#211C18",
        muted: "#8A7F72",
        gold: {
          DEFAULT: "#A9803F",
          dark: "#8A6529",
          light: "#E8C978",
        },
        border: "#EAE1D3",
        "border-soft": "#F1EAE0",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(74,54,28,.06), 0 14px 28px -12px rgba(74,54,28,.2), 0 36px 64px -32px rgba(74,54,28,.3)",
        soft: "0 1px 2px rgba(74,54,28,.05), 0 8px 18px -9px rgba(74,54,28,.16)",
        pill: "0 1px 2px rgba(74,54,28,.05), 0 12px 26px -12px rgba(74,54,28,.18), 0 32px 60px -30px rgba(74,54,28,.26)",
      },
    },
  },
  plugins: [],
};

export default config;
