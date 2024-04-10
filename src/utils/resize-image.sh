#!/bin/bash

# Function to display help message
show_help() {
    echo "Usage: $0 <source_folder> <destination_folder>"
    echo
    echo "This script resizes all images in the source folder"
    echo "and saves the resized images to the destination folder."
    echo
    echo "Arguments:"
    echo "  source_folder       The folder containing the images to resize."
    echo "  destination_folder  The folder where the resized images will be saved."
    echo
    echo "Options:"
    echo "  --help              Display this help message and exit."
}

# Check if --help is provided as an argument
if [[ "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Error: Two arguments are required."
    show_help
    exit 1
fi

# Assign arguments to variables
SOURCE_FOLDER=$1
DESTINATION_FOLDER=$2

# Check if the source folder exists
if [ ! -d "$SOURCE_FOLDER" ]; then
    echo "Error: Source folder '$SOURCE_FOLDER' does not exist."
    exit 1
fi

# Create the destination folder if it doesn't exist
mkdir -p "$DESTINATION_FOLDER"

# Loop through all the images in the source folder
for IMAGE in "$SOURCE_FOLDER"/*.{jpg,jpeg,png,gif}; do
    # Check if the file is an image
    if [ -f "$IMAGE" ]; then
        # Get the base name of the image file
        FILENAME=$(basename "$IMAGE")
        # Resize the image and save it in the destination folder
        node resize.js "$SOURCE_FOLDER" "$DESTINATION_FOLDER"
    fi
done

echo "Image resizing completed."

