/** Tailwind config for cong-dvc-demo (Phase 1a static demo).
 *  Tokens mirror styles.css so utilities sit on top of the existing CSS without conflicting.
 *  Build: `./tools/tailwindcss.exe -c tailwind.config.js -i tailwind.input.css -o tailwind.output.css --minify`
 *  Watch: `./tools/tailwindcss.exe -c tailwind.config.js -i tailwind.input.css -o tailwind.output.css --watch`
 */
module.exports = {
  content: ['./*.html', './layout.js', './data.js'],
  // styles.css already sets a CSS reset & body font — disable Tailwind's preflight so
  // utilities don't fight the existing component styles.
  corePlugins: { preflight: false },
  // Avoid class-name collisions with utility-shaped class names already in styles.css
  // (e.g. `.card`, `.btn`, `.muted`). Tailwind utilities are unprefixed; component-level
  // classes in styles.css are untouched.
  theme: {
    screens: {
      'xs': '360px',   // smallest supported phone per Constitution VI
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        red: {
          50:  '#FBF1EC', 100: '#F5DDD0', 200: '#EDC1AB',
          500: '#E9926F', 600: '#CE7A58', 700: '#B5613D',
          800: '#8E4B30', 900: '#6B381F',
        },
        slate: {
          50:  '#F5F5F5', 100: '#EBEEF0', 200: '#DBDCE0',
          300: '#ADBCC3', 400: '#8B98A0', 500: '#666666',
          600: '#555555', 700: '#292D34', 800: '#1E2F41',
          900: '#1E2F41',
        },
        amber:  { 50: '#FBF4D9', 500: '#EAC344', 700: '#B59023' },
        green:  { 50: '#E6F4EC', 500: '#219653', 700: '#176C3E' },
        blue:   { 50: '#E9F0F8', 300: '#93c5fd', 500: '#2A6EBB', 700: '#1F558F' },
        violet: { 50: '#F5F3FF', 500: '#8B5CF6', 700: '#6D28D9' },
        brand: {
          red:      '#B91C1C',
          'red-dark': '#8E1414',
        },
        graphite: {
          DEFAULT: '#2D3142',
          dark:    '#1F2230',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', '-apple-system', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '6px', lg: '8px' },
      boxShadow: {
        sm: '0 1px 2px rgba(30,47,65,.05)',
        DEFAULT: '0 1px 3px rgba(30,47,65,.08)',
      },
    },
  },
  plugins: [],
};
