import type { Config } from 'tailwindcss';

export default {
  // images: {
  //   domains: ['images.unsplash.com'], // 여기에 사용할 도메인 추가
  // },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       lightHover: '#fcf4ff',
  //       darkHover: '#2a004a',
  //       darkTheme: '#11001f',
  //     },
  //     fontFamily: {
  //       Outfit: ['Outfit', 'sans-serif'],
  //       Ovo: ['Ovo', 'serif'],
  //     },
  //     boxShadow: {
  //       black: '4px 4px 0 #000',
  //       white: '4px 4px 0 #fff',
  //     },
  //     gridTemplateColumns: {
  //       auto: 'repeat(auto-fill, minmax(150px, 1fr))',
  //     },
  //   },
  // },
  // darkMode: 'selector',
  darkMode: 'class',
  plugins: [],
} satisfies Config;
