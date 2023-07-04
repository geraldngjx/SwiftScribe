describe("Upload Page", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();
  });

  it("Validates Navbar Links", () => {
    cy.get(".nav-links").contains("Upload Media").click();
    cy.url().should("include", "/upload");

    cy.get(".nav-links").contains("Manage Files").click();
    cy.url().should("include", "/manage");
  });

  it("Validates Sign out functionality", () => {
    cy.get(
      ".w-full.rounded-md.bg-gray-700.text-gray-200.hover\\:bg-gray-600.py-2"
    ).click();

    cy.url().should("include", "/login");
  });
});
