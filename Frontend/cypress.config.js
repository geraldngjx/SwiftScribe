const { defineConfig } = require("cypress");

module.exports = defineConfig({
  specPattern: "cypress/e2e",
  e2e: {
    setupNodeEvents(on, config) {},
  },
});
