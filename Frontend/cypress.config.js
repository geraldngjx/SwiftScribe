const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e",
    setupNodeEvents(on, config) {},
    defaultCommandTimeout: 120000, //set timeout to 2 mins to allow time for transcription and summarisation
  },
});
