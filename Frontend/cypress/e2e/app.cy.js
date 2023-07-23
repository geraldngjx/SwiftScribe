describe("Login", () => {
  it("should log in successfully", () => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Check if the user is redirected to the home page
    cy.url().should("include", "/");

    cy.contains("Sign out").should("be.visible");
  });

  it("should display an error message for invalid credentials", () => {
    // Start from the login page
    cy.visit("https://swift-scribe.vercel.app/signin");

    // Enter an invalid email and password in the input fields
    cy.get('input[type="email"]').type("invalid@example.com");
    cy.get('input[type="password"]').type("incorrectpassword");

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Check if an error message is displayed
    cy.get("p.text-red-500")
      .should("be.visible")
      .contains("Invalid Email or Password");
  });
});
