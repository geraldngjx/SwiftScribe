# SwiftScribe
SwiftScribe is an innovative web application that automatically transcribes and summarizes video content, making it easily digestible and accessible. This GitHub repository contains the source code for SwiftScribe, enabling developers to contribute to its development, customize its features, and collaborate on its improvement. 

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
