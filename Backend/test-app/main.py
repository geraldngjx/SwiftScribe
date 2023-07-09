import os
import whisper
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn
from translatepy import Translator 
import logging

app = FastAPI()

class Source(BaseModel):
    source: str
    language: str

class TextData(BaseModel):
    text: str

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Function to transcribe audio from a local file
def transcribe_local_audio(file_path, language):
    logger.info(f"Transcribing audio from file: {file_path}")

    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Load the whisper model
    model = whisper.load_model("base")
    options = dict(language="english", beam_size=5, best_of=5)
    translate_options = dict(task="translate", **options)

    # Transcribe the audio
    result = model.transcribe(file_path, **translate_options)

    logger.info("Audio transcription completed")

    # Initialize the translator
    translator = Translator()

    # Translate the transcription
    logger.info(f"Translating the transcription to language: {language}")
    translated_text = translator.translate(result["text"], language).result

    logger.info("Translation completed")

    return translated_text

@app.post("/transcribe/local")
def transcribe_local(source: Source):
    return transcribe_local_audio(source.source, source.language)

# Initialize the summarizer without setting the max_length parameter
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.post("/summarize")
def summarize_text(data: TextData):
    logger.info("Summarizing text")

    # Determine the length of the input text
    text_length = len(data.text)

    # Adjust the max_length parameter based on the text length
    max_length = min(text_length * 2, 1024)  # Set a maximum of 1024 or double the text length, whichever is smaller

    # Summarize the text with the adjusted max_length
    summary = summarizer(data.text, max_length=max_length, min_length=30, do_sample=False)

    logger.info("Text summarization completed")

    return {"summary": summary[0]["summary_text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)