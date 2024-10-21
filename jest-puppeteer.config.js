module.exports = {
  launch: {
    headless: false, // Headed mode for easier debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--load-extension=./path-to-your-extension-folder',
      '--disable-extensions-except=./path-to-your-extension-folder',
    ],
  },
};