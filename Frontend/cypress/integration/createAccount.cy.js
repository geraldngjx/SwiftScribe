describe("Signup", () => {
  it("should sign up successfully", () => {
    // Start from the signup page
    cy.visit("https://swift-scribe.vercel.app/signup");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/");

    cy.contains("Sign out").should("be.visible");
  });

  it("should display an error message for existing email", () => {
    cy.visit("https://swift-scribe.vercel.app/signup");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();

    cy.get("p.text-red-500")
      .should("be.visible")
      .contains("Email or Password has been taken!");
  });
});
