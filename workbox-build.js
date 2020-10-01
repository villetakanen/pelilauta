/* eslint-disable */
const workboxBuild = require('workbox-build');

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'public/service-worker.js',
    swDest: 'dist/service-worker.js',
    globDirectory: 'dist',
    globPatterns: [
      '**\/*.{js,css,html,png,svg}',
    ]
  }).then(({count, size, warnings}) => {
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  });
}

buildSW()
