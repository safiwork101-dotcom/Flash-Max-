import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#020506",
        ink: "#071013",
        panel: "#0a1115",
        line: "rgba(132, 204, 192, 0.18)",
        aqua: "#00d8ff",
        mint: "#2ff4b1",
        lime: "#b7ff5a",
        ember: "#ffbd4a",
        coral: "#ff6b6b",
      },
      boxShadow: {
        glow: "0 0 50px rgba(0, 216, 255, 0.18)",
        button: "0 18px 50px rgba(0, 216, 255, 0.22)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 24s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
