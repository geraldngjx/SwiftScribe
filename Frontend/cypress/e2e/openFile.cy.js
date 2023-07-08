import React from "react";

describe("FileRow", () => {
  beforeEach(() => {
    cy.visit("https://swift-scribe.vercel.app/signin");

    cy.get('input[type="email"]').type("ryantzr@gmail.com");
    cy.get('input[type="password"]').type("testing12345");

    cy.get('button[type="submit"]').click();

    cy.visit("https://swift-scribe.vercel.app/upload");

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
    cy.get(".text-transcription-container button").contains("Save").click();

    cy.visit("https://swift-scribe.vercel.app/");
  });

  it("should delete a file when the Delete button is clicked", () => {
    const onDelete = cy.stub().as("onDelete");

    cy.get("button").contains("Delete").click();

    cy.get(".fixed.inset-0").should("be.visible");

    cy.get(".fixed.inset-0 button")
      .contains("Open")
      .click()
      .then(() => {
        expect(onDelete);
      });
  });
});
