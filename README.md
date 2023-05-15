# SwiftScribe
SwiftScribe is an innovative web application that automatically transcribes and summarizes video content, making it easily digestible and accessible. This GitHub repository contains the source code for SwiftScribe, enabling developers to contribute to its development, customize its features, and collaborate on its improvement.  

## Key Features:
**Video uploading and processing:** Users can upload videos, and the application will extract the audio for transcription and summarization.  
**Speech-to-text transcription:** The application utilizes the Whispers AI model from Hugging Face to convert audio into accurate text transcriptions.  
**Text summarization:** Using the BART AI model from Hugging Face, the application generates concise summaries of the transcribed text.  
**Multi-language support:** SwiftScribe automatically detects the language of the video's audio track and applies the appropriate transcription and summarization models.  
**Accessibility features:** The application supports closed captions, translations, keyboard navigation, and high-contrast themes to cater to users with hearing difficulties or language barriers.  
**Integration with video conferencing platforms:** SwiftScribe seamlessly integrates with platforms like Google Meet and Zoom, allowing users to share summaries during video conferences.  

## Tech Stack:
**Frontend:** Express.js, Next.js  
**Backend:** Node.js, MongoDB  
**Authentication and Authorization:** Firebase with OAuth 2.0  
**Audio Processing:** FFmpeg  
**AI Models:** Whispers (Hugging Face) for speech-to-text transcription, BART (Hugging Face) for text summarization  
**Deployment:** Amazon EC2, Vercel  

### Note:
For a complete understanding of the project and its functionalities, please refer to the project's documentation and codebase.  
