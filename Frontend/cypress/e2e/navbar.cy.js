describe("Navbar", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();

    // Check if the user is authenticated and home page is loaded
    cy.url().should("include", "/");
    cy.get(".logo").should("be.visible");
  });

  it("Validates Navbar Links", () => {
    // Click on Dashboard
    cy.get(".nav-links").contains("Dashboard").click();
    cy.url().should("include", "/");

    cy.wait(5000);
    cy.get(".nav-links").contains("Upload Media").click();

    cy.url().should("include", "/upload");

    cy.wait(5000);

    cy.get(".nav-links").contains("Manage Files").click();
    cy.url().should("include", "/manage");
  });

  it("Validates Sign out functionality", () => {
    cy.get("button").contains("Sign out").click();

    cy.url().should("include", "/login");
  });
});
