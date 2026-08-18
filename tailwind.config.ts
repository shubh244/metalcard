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
        graphite: "#0B0D10",
        steel: "#1A1E24",
        silver: "#C8CDD4",
        ice: "#E8ECF1",
        brass: "#B8A06A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "metal-radial":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,205,212,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(184,160,106,0.06), transparent 50%)",
        "brushed-metal":
          "linear-gradient(135deg, #2a2f38 0%, #1a1e24 25%, #3a404c 45%, #15181e 60%, #2e333c 80%, #1a1e24 100%)",
      },
      boxShadow: {
        metal:
          "0 25px 50px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        "metal-sm":
          "0 8px 24px -8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
