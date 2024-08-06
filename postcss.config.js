module.exports = {
  plugins: [
    "tailwindcss",
    "autoprefixer",
    // [
    //   "@fullhuman/postcss-purgecss",
    //   {
    //     content: [
    //       "./pages/**/*.{ts,tsx}",
    //       "./ui-base/**/*.{ts,tsx}",
    //       "./ui-base/components/**/*.{ts,tsx}",
    //       "./sites/**/*.{ts,tsx}",
    //       "./ui-base/styles/*.css",
    //     ],    
    //     safelist: {
    //       standard: [
    //         /^h-\[\d+px\]$/, 
    //         /^sm:h-\[\d+px\]$/, 
    //         /^sm:w-\[\d+px\]$/, 
    //         /^z-\[\d+\]$/, 
    //         /^top-\[\d+px\]$/,
    //         /^h-\[calc\(\d+vh-\d+px\)\]/,
    //         /^md:h-\[calc\(\d+vh-\d+px\)\]/,
    //         /^slick/,
    //         'mx-1',
    //         'h-2.5',
    //         'w-2.5',
    //       ],
    //     },
    //     defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    //   },
    // ],
    "postcss-preset-env",
    process.env.NODE_ENV === 'production' ? ['cssnano', { preset: 'default' }] : null,
  ],
}; 
