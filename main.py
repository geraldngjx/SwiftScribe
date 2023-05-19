import argparse
import os
import sys
import pytube
import whisper

# Function to transcribe audio from a local file
def transcribe_local_audio(file_path):
    # Check if the file exists
    if not os.path.exists(file_path):
        print(file_path)
        return "File not found"

    print(f"Transcribing local audio file: {file_path}")

    # Load the whisper model
    model = whisper.load_model("base")

    # Transcribe the audio
    result = model.transcribe(file_path)

    # Print the transcription
    print(result["text"])

    # Remove the original file
    os.remove(file_path)

    return result["text"]

# Function to transcribe audio from a YouTube video
# def transcribe_youtube_audio(url): 
#     print(f"Transcribing audio from YouTube URL: {url}")

#     # Retrieve video data
#     data = pytube.YouTube(url)

#     # Get the audio stream only
#     audio = data.streams.get_audio_only()

#     # Download the audio
#     audio.download(filename="test.mp3")

#     # Load the whisper model
#     model = whisper.load_model("base")

#     # Transcribe the audio
#     result = model.transcribe("test.mp3")

#     # Print the transcription
#     print(result["text"])

#     # Remove the downloaded audio file
#     os.remove("test.mp3")

#     return result["text"]

if __name__ == "__main__":
    # Argument parser for CLI input
    parser = argparse.ArgumentParser(description="Transcribe audio file or YouTube URL")
    parser.add_argument("source", help="Path to audio file or YouTube URL")
    parser.add_argument("func", help="Function to call: 'transcribe_local_audio' or 'transcribe_youtube_audio'")
    args = parser.parse_args()

    if args.func == "transcribe_local_audio":
        print(transcribe_local_audio(args.source))
    # elif args.func == "transcribe_youtube_audio":
    #     print(transcribe_youtube_audio(args.source))
    else:
        sys.exit(f"Invalid function name: {args.func}")
