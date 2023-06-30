import os
import whisper
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI()

class Source(BaseModel):
    source: str

class TextData(BaseModel):
    text: str

# Function to transcribe audio from a local file
def transcribe_local_audio(file_path):
    print(file_path)
    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Load the whisper model
    model = whisper.load_model("base")

    options = dict(language=language, beam_size=5, best_of=5)
    translate_options = dict(task="translate", **options)


    # Transcribe the audio
    result = model.transcribe(file_path, **translate_options)

    return result["text"]

@app.post("/transcribe/local")
def transcribe_local(source: Source):
    return transcribe_local_audio(source.source)

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.post("/summarize")
def summarize_text(data: TextData):
    summary = summarizer(data.text, max_length=130, min_length=10, do_sample=False)

    return {"summary": summary[0]["summary_text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)