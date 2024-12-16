import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        primary: 'var(--primary)',
      },
      borderWidth: {
        'l-10': '10px',
        't-6': '6px',
        'b-6': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
