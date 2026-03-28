import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          dark: "#0a0a0a",
          card: "#1a1a1a",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
export default config;
