/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './app/components/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '1.5rem',
                    lg: '2rem',
                },
            },
            colors: {
                primary: {
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                },
            },
            fontFamily: {
                inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
            },
            borderRadius: {
                xl: '1rem',
            },
            boxShadow: {
                smsoft: '0 4px 18px rgba(12, 10, 24, 0.06)',
                soft: '0 10px 30px rgba(12, 10, 24, 0.08)',
                strong: '0 18px 50px rgba(12, 10, 24, 0.12)',
            },
        },
    },
    plugins: [],
};

