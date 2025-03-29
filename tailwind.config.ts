import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        bgPrimary: "var(--color-bg-primary)",
        tBase: "var(--color-text-base)",
      },
    },
  },
  plugins: [],
};
export default config;  