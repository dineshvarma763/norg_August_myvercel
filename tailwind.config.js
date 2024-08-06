const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "pages/**/*.{ts,tsx}",
    "ui-base/**/*.{ts,tsx}",
    "ui-base/components/**/*.{ts,tsx}",
    "sites/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  purge: {
    enabled: true,
    content: [
      "pages/**/*.{ts,tsx}",
      "ui-base/**/*.{ts,tsx}",
      "ui-base/components/**/*.{ts,tsx}",
      "sites/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
    ],
    options: {
      whitelistPatterns: [/^bg-/, /^text-/],
    },
  },
  // commented out below code as it causes build times to explode
  // darkMode: ["class"],
  // content: [
  //   "pages/**/*.{ts,tsx}",
  //   "ui-base/**/*.{ts,tsx}",
  //   "ui-base/components/**/*.{ts,tsx}",
  //   "sites/**/*.{ts,tsx}",
  //   "./app/**/*.{ts,tsx}",
  // ],
  // safelist: [
  //   {pattern: /(bg|text|border)-./},
  // ],
  theme: {
    minHeight: {
      96: "24rem",
      81: "317px",
      100: "100%",
    },
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        black45: "var(--black-45)",
        black20: "var(--black-20)",
        black80: "var(--black-80)",
        "my-yellow": "var(--yellow)",
        lighterYellow: "var(--lighter-yellow)",
        "my-brown-grey": "var(--ata-brown-grey)",
        "my-dark-blue": "var(--dark-blue)",
        "my-dark-blue-400": "var(--dark-blue-400)",

        charcoal: "var(--charcoal)",
        "my-indigo": "var(--indigo)",
        "my-lighterIndigo": "var(--lighter-indigo)",
        "my-darkerIndigo": "var(--darker-indigo)",

        "my-charcoal": "var(--charcoal)",
        "my-white": "var(--white)",
        "my-white2": "var(--white2)",
        "my-white3": "var(--white3)",

        "my-black": "var(--black)",
        "my-black-33": "var(--black-33)",
        "my-btntext": "var(--btntext)",

        "my-blue": "var(--blue)",

        "my-purple": "var(--purple)",

        "my-grey": "var(--grey)",
        "my-grey2": "var(--grey2)",
        "my-grey3": "var(--grey3)",
        "my-grey4": "var(--grey4)",
        gray: {
          700: "var(--gray-700)",
        },

        "my-border-gray-600": "var(--border-gray-600)",
        "my-border-gray-700": "var(--border-gray-700)",
        "my-border-purple": "var(--border-purple)",
        "my-brwhite": "var(--br-white)",

        // need to be updated
        primary: "#570df8",
        primaryText: "#fff",
        secondary: "#f000b8",
        secondaryText: "#ffffff",
      },
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
        urbanist: ["var(--font-urbanist)", "sans"],
        comfortaa: ["var(--font-comfortaa)", "sans"],
      },
      fontSize: {
        h1: "60px",
        h2: "40px",
        h3: "28px",
        h4: "26px",
        h5: "16px",
        strap: "20px",
        body1: "18px",
        body2: "16px",
        body3: "14px",
        nav: "14px",
        xxs: "10px",
      },
      lineHeight: {
        h1: "70px",
        h2: "30px",
        h3: "32px",
        h4: "30px",
        h5: "22px",
        strap: "30px",
        body1: "24px",
        body2: "22px",
        body3: "20px",
        nav: "21px",
        inputlabel: "17.5px",
      },
      fontWeight: {
        800: 800,
        600: 600,
        500: 500,
        400: 400,
      },
      letterSpacing: {
        "0.1em": "0.1em",
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        navContent: "0 0 10px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        "5px": "5px",
        30: "30px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        animatedgradient: {
          "0%, 50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0 100%",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        animatedgradient: "animatedgradient 1.5s ease-in-out infinite forwards",
        meteor: "meteor 5s linear infinite",
      },
      height: {
        168: "673px",
        100: "400px",
        61: "245px",
        58: "233px",
        25: "100px",
        48: "194px",
        18: "75px",
      },
      width: {
        25: "100px",
        61: "245px",
        "95-per": "95%",
        18: "75px",
      },
      maxWidth: {
        170: "170px",
        236: "236px",
        793: "793px",
      },
      zIndex: {
        100: "100",
      },
      margin: {
        "7-per": "7%",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
  },
}
