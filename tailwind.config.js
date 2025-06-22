/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF1CA',
        'accent': '#FFB823',
        'mid-green': '#708A58',
        'dark-green': '#2D4F2B',
        'text-main': '#2c2c2c',
      },
    },
  },
  plugins: [],
}