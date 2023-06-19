// describe("UploadPage", () => {
//   beforeEach(() => {
//     // Log in before each test
//     cy.visit("https://swift-scribe.vercel.app/signin");
//     cy.get('input[type="email"]').type("ryantzr@gmail.com");
//     cy.get('input[type="password"]').type("testing12345");
//     cy.get('button[type="submit"]').click();
//     cy.contains("Sign out").should("be.visible");
//   });

//   it("should upload a file successfully", () => {
//     cy.visit("https://swift-scribe.vercel.app/upload");

//     // Read the file contents using cy.fixture()
//     cy.fixture("testVideoSwiftScribe.mp4").then((fileContent) => {
//       // Create a Blob from the file content
//       const blob = Cypress.Blob.base64StringToBlob(fileContent);

//       // Create a File object from the Blob
//       const file = new File([blob], "testVideoSwiftScribe.mp4");

//       // Select the file input element and set its value to the File object
//       cy.get('input[type="file"]').then((el) => {
//         const dataTransfer = new DataTransfer();
//         dataTransfer.items.add(file);
//         el[0].files = dataTransfer.files;
//         el[0].dispatchEvent(new Event("change", { bubbles: true }));
//       });

//       // Verify the file name is displayed
//       cy.get('input[type="text"]').should(
//         "have.value",
//         "testVideoSwiftScribe.mp4"
//       );

//       // Verify the transcribed text is updated
//       cy.get("textarea").should(
//         "have.value",
//         "This is a sample transcribed text."
//       );

//       // Click the "Save" button
//       cy.contains("Save").click();

//       // Verify the success notification is displayed
//       cy.contains("File uploaded successfully.").should("be.visible");
//     });
//   });

//   it("should display an error message when no file is selected", () => {
//     cy.visit("https://swift-scribe.vercel.app/upload");

//     // Click the "Save" button without selecting a file
//     cy.contains("Save").click();

//     // Verify the error notification is displayed
//     cy.contains("Please select a file.").should("be.visible");
//   });
// });
