module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/tests/**/*.spec.jsx', watched: true },
      { pattern: 'src/tests/**/*.spec.js', watched: true },
    ],
    preprocessors: {
      'src/tests/**/*.spec.jsx': ['esbuild'],
      'src/tests/**/*.spec.js': ['esbuild'],
      'src/**/*.jsx': ['esbuild'],
      'src/**/*.js': ['esbuild'],
    },
    esbuild: {
      jsx: 'automatic',
      target: 'es2018',
      sourcemap: 'inline',
      loader: { '.js': 'jsx', '.jsx': 'jsx', '.json': 'json', '.png': 'file' },
      define: { 'process.env.NODE_ENV': '"test"' },
    },
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: false,
    // EXPLO: carga explícita de plugins para evitar "You need to include some adapter..."
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-esbuild'),
      require('karma-spec-reporter'),
    ],
  });
};