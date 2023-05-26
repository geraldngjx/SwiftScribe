#!/bin/bash

if [ "$FFMPEG_INSTALL" == "true" ]; then
  echo "Installing ffmpeg..."

  # Check the operating system
  if [ "$VERCEL_ENV" == "production" ]; then
     echo "Detected Linux environment (Vercel production)"
    sudo apt update
    sudo apt install ffmpeg -y
  elif [ "$VERCEL_ENV" == "development" ]; then
     echo "Detected macOS environment (Vercel development)"
    brew install ffmpeg
  else
    echo "Unknown environment"
    exit 1
  fi
fi
