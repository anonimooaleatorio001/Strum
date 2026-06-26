import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // New brand palette
        forest: "#18542a",
        "forest-deep": "#0c3014",
        cream: "#f3e8cc",
        sunshine: "#ffc926",
        carrot: "#f96015",
        tomato: "#d52518",
        kiwi: "#9abc05",
        // Legacy aliases remapped onto the new palette so the whole app
        // adopts the redesign without renaming every class.
        cyprus: "#18542a",
        sand: "#f3e8cc",
        ochre: "#f96015",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      boxShadow: {
        glass:
          "inset 0 1px 1px rgba(255,255,255,0.35), 0 18px 50px -20px rgba(12,48,20,0.45)",
        pop: "0 5px 0 #0c3014",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)", filter: "blur(6px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "fade-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "hero-rise": {
          from: { opacity: "0", transform: "translateY(64px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "wave-drift": {
          "0%,100%": { transform: "translateY(0) scaleY(1)" },
          "50%": { transform: "translateY(-10px) scaleY(1.015)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "fade-down": "fade-down 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "hero-rise": "hero-rise 1.1s cubic-bezier(0.22,1,0.36,1) both",
        "wave-drift": "wave-drift 12s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
