/** @type {import('tailwindcss').Config} */
import { vivakitPreset } from "@vivakits/react-components";
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
     "./node_modules/@vivakits/react-components/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  presets: [vivakitPreset], 
  plugins: [],
}
