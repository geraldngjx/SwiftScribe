import requests

url = 'http://localhost:8000/transcribe/local'

# Set the file path and language for transcription
file_path = '5607.mp4'
language = 'Chinese'

# Create the request payload
payload = {
    'source': file_path,
    'language': language
}

# Send the POST request
response = requests.post(url, json=payload)

# Check the response status code
if response.status_code == 200:
    result = response.json()
    print(f'Transcription: {result}')
else:
    print(f'Request failed with status code: {response.status_code}')
