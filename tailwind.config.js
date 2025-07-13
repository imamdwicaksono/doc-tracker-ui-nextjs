// tailwind.config.ts
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // opsional: custom animation
    },
  },
  plugins: [],
}