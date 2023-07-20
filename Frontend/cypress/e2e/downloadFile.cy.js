describe("Export Function", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();

    // Check if the user is authenticated and home page is loaded
    cy.url().should("include", "/");
    cy.get(".logo").should("be.visible");
  });

  it("Validates Export PDF Functionality", () => {
    // Click on 'Export' button to open the export options
    cy.wait(7000);

    cy.contains("div", "Open").click();

    cy.wait(2000);

    cy.get("button").contains("Export").click();

    // Confirm export options are now visible
    cy.get("select").should("be.visible");

    // Select 'PDF' from the dropdown
    cy.get("select").select("PDF");

    // Click on 'Download' button
    cy.get("button").contains("Download").click();

    const path = require("path");
    const downloadsFolder = "./downloads";

    cy.wait(3000);

    it("Verify the downloaded file", () => {
      cy.readFile(path.join(downloadsFolder, "5607.mp4.pdf")).should("exist");
    });
  });

  it("Validates Export TXT Functionality", () => {
    // Click on 'Export' button to open the export options
    cy.wait(7000);

    cy.contains("div", "Open").click();

    cy.wait(2000);

    cy.get("button").contains("Export").click();

    // Confirm export options are now visible
    cy.get("select").should("be.visible");

    // Select 'Text File' from the dropdown
    cy.get("select").select("Text File");

    // Click on 'Download' button
    cy.get("button").contains("Download").click();

    const path = require("path");
    const downloadsFolder = "./downloads";

    cy.wait(3000);

    it("Verify the downloaded file", () => {
      cy.readFile(path.join(downloadsFolder, "5607.mp4.pdf")).should("exist");
    });
  });
});
