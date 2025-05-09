/** @type {import('tailwindcss').Config} */
// const {green} = require("next/dist/lib/picocolors");
// import daisyui from 'daisyui'
// const plugin = require('daisyui');
// const config = require("@/postcss.config.mjs");
// const config = require("tailwindcss/config");

// const flowbite = require("flowbite-react/tailwind");

module.exports = {
    darkMode: ["class"],
    // lightMode: ["class"],
    corePlugins: {
        preflight: false,
    },

    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",

        // "./src/**/*.{html,js}",
        // "./node_modules/flowbite/**/*.js"
        // flowbite.content(),
    ],
    theme: {
        extend: {
            colors: {
                'dark-green': '#1A4D2E',
                'medium-green': '#4F6F52',
                'medium-beige': '#E8DFCA',
                'light-beige': '#F5EFE6',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                // primary: {
                //     DEFAULT: 'hsl(var(--primary))',
                //     foreground: 'hsl(var(--primary-foreground))'
                // },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        require('daisyui')
    ],
    daisyui: {
        themes: [
            "light",
            "dark",
            "fantasy",
            "cupcake",
            "valentine",
            "emerald",
            "pastel",
            "winter",
            "corporate"
        ],
        // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: 'dark', // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ":root", // The element that receives theme color CSS variables
    },
};
