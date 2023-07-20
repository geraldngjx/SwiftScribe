describe("High Contrast Mode", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();

    // Check if the user is authenticated and home page is loaded
    cy.url().should("include", "/");
    cy.get(".logo").should("be.visible");
  });

  it("Validates High Contrast Mode", () => {
    cy.wait(3000);

    cy.contains("div", "Open").click();

    cy.wait(2000);

    // Check that high contrast mode is initially off
    cy.get(".edit-page").should("not.have.class", "high-contrast");

    // Click on High Contrast Mode Toggle Button
    cy.contains("label", "High Contrast").parent().find("div").eq(1).click();

    // Check that high contrast mode is now on
    cy.get(".edit-page").should("have.class", "high-contrast");

    // Click on Normal View Mode Toggle Button to turn it off again
    cy.contains("label", "Normal View").parent().find("div").eq(1).click();

    // Check that high contrast mode is off again
    cy.get(".edit-page").should("not.have.class", "high-contrast");
  });
});
