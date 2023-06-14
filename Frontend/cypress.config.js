const { defineConfig } = require("cypress");

module.exports = defineConfig({
  integrationFolder: "cypress/e2e",
  e2e: {
    setupNodeEvents(on, config) {},
  },
});
