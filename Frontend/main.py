import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import whisper

app = FastAPI()

class Source(BaseModel):
    source: str

# Function to transcribe audio from a local file
def transcribe_local_audio(file_path):
    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Load the whisper model
    model = whisper.load_model("base")

    # Transcribe the audio
    result = model.transcribe(file_path)

    return result["text"]

@app.post("/transcribe/local")
def transcribe_local(source: Source):
    return transcribe_local_audio(source.source)
