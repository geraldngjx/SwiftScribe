# SwiftScribe
SwiftScribe is an innovative web application that transcribes and summarizes video content, making it easily digestible and accessible. This GitHub repository contains the source code for SwiftScribe, enabling developers to contribute to its development, customize its features, and collaborate on its improvement. 

## Product Demo
[![SwiftScribe Product Demo](https://github.com/geraldngjx/SwiftScribe/assets/102348985/54b6a235-c2ff-4db7-9e32-1f63cedb3b07)

## Live Deployment:
https://swift-scribe.vercel.app/

## Key Features:
**Video uploading and processing:** Users can upload videos, and the application will extract the audio for transcription and summarization.  
**Speech-to-text transcription:** The application utilizes the Whispers AI model from Hugging Face to convert audio into accurate text transcriptions.  
**Text summarization:** Using the BART AI model from Hugging Face, the application generates concise summaries of the transcribed text.  
**Multi-language support:** SwiftScribe applies the appropriate transcription and summarization models and allows users to select their language of choice for the transcribed/summarised text.  
**Accessibility features:** The application supports closed captions, translations, keyboard navigation, and high-contrast themes to cater to users with hearing difficulties or language barriers.  
**Exportation of Files:** SwiftScribe enables users to easily export their transcribed/summarised text in PDF and text document format for their own personal use. This allows users to be able to view their document both online and offline.  

## Tech Stack:
**Frontend:** Express.js, Next.js  
**Backend:** Node.js, MongoDB  
**Authentication and Authorization:** Firebase with OAuth 2.0  
**Audio Processing:** FFmpeg  
**AI Models:** Whispers (Hugging Face) for speech-to-text transcription, BART (Hugging Face) for text summarization, Translatepy for translation  
**Deployment:** Vercel, Ngrok, Uvicorn

## Note:
For a complete understanding of the project and its functionalities, please refer to the project's documentation and codebase. 

## References:
_The following links are the sources of resources or education that we have utilised in the development of SwiftScribe. We have written the code we have used ourselves while referencing the sources below, hence there is a possibility that some of our code may bear some level of similarity to the ones below. This is our declaration to abide by NUS Plagiarism Policy._

**Main Reference for the setting up of the Ngrok server powered with Nodemon:**  
https://philna.sh/blog/2021/03/15/restart-app-not-tunnel-ngrok-nodemon/   
  
**Main Reference for the firebase authentication configuration:**  
https://github.com/sairajchouhan/nextjs-firebase-auth   
  
**Main Reference for Vercel Deployment:**  
https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/   
  
**Main Reference for MongoDB integration with NextJS:**  
https://blog.openreplay.com/a-complete-guide-to-nextjs-plus-mongodb/   
https://jasonwatmore.com/next-js-11-mongodb-connect-to-mongo-database-with-mongoose   
  
**Main Reference for the frontend website (Personal Template):**  
https://github.com/nreHieW/FRIDAY/tree/main/FRIDAY%20Main%20Website   
  
**Main Reference for the powerpoint slide used in the Demo Video:**  
https://free-powerpoint-templates-download.com/morph-transition-presentation/     
  
**Main Reference for Cypress:**  
https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Test-Structure   
  
**Main Reference for OpenAI Whisper:**  
https://github.com/openai/whisper   
