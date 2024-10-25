/** @type {import('tailwindcss').Config} */

import tailwindScrollbar from 'tailwind-scrollbar';

export default {
    darkMode: 'selector',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // animation: {
            //   "custom-ping": "customPing 2s cubic-bezier(0, 0, 0.9, 1) infinite",
            // },
            // keyframes: {
            //   customPing: {
            //     "0%": { transform: "scale(1)", opacity: "1" },
            //     "100%": { transform: "scale(2)", opacity: "0" },
            //   },
            // },
            animation: {
                quiet: 'quiet 1.6s ease-in-out infinite',
                slow: 'slow 2s ease-in-out infinite',
                loud: 'loud 1.4s ease-in-out infinite',
            },
            keyframes: {
                quiet: {
                    '25%': { transform: 'scaleY(.6)' },
                    '50%': { transform: 'scaleY(.4)' },
                    '75%': { transform: 'scaleY(.8)' },
                },
                slow: {
                    '25%': { transform: 'scaleY(.8)' },
                    '50%': { transform: 'scaleY(.4)' },
                    '75%': { transform: 'scaleY(.6)' },
                },
                loud: {
                    '25%': { transform: 'scaleY(1)' },
                    '50%': { transform: 'scaleY(.4)' },
                    '75%': { transform: 'scaleY(1.2)' },
                },
            },

            colors: {
                grayPrimary: '#F2F2F2 !important',
                bluePrimary: '#3186FE !important',
                slatePrimary: '#F7F8FA !important',
                darkPrimary: '#1E293B !important',
                dark2Primary: '#334155 !important',
            },
            backgroundColor: {
                grayPrimary: '#F2F2F2 !important',
                bluePrimary: '#3186FE !important',
                slatePrimary: '#F7F8FA !important',
                darkPrimary: '#1E293B !important',
                dark2Primary: '#334155 !important',
            },
        },
    },
    plugins: [tailwindScrollbar({ preferredStrategy: 'pseudoelements' })],
};
