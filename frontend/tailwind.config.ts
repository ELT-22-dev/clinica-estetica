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
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
