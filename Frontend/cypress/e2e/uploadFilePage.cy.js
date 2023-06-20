describe("Upload Page", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signup");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.visit("https://swift-scribe.vercel.app/upload");
  });

  it("displays the upload page", () => {
    cy.get(".upload-page")
      .should("be.visible")
      .within(() => {
        cy.get("h1").should("contain", "Upload Media");
        cy.get(".video-upload-container").should("be.visible");
        cy.get(".text-transcription-container").should("be.visible");
      });
  });

  it("uploads a file, displays its name and performs extraction", () => {
    const fileName = "./cypress/fixtures/5607.mp4"; //this is found in the fixtures folder
    const uploadedFileName = "5607.mp4"; //this is found in the text box in our upload media page
    cy.get(".video-upload-container .panel button").contains("Upload").click();

    cy.get("input[type=file]")
      .invoke("attr", "style", "display: block")
      .selectFile(fileName);

    cy.get(".text-transcription-container input[type=text]").should(
      "have.value",
      uploadedFileName
    );
    // click extract button
    cy.get(".text-transcription-container button").contains("Extract").click();

    // validate that the "In Progress" button appears, indicating that extraction is ongoing
    cy.get(".video-upload-container .panel button")
      .contains("In Progress")
      .should("be.visible");

    cy.get(".video-upload-container .panel button")
      .contains("Completed")
      .should("be.visible");

    // click save button
    cy.get(".text-transcription-container button").contains("Save").click();
  });
});
