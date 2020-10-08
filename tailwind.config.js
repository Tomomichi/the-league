module.exports = {
  purge: [
    './pages/**/*.js',
    './components/**/*.js',
    './lib/**/*.js',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
