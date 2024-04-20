#!/bin/bash

# Function to display help message
show_help() {
    echo "Usage: $0 <source_folder> <width> <height>"
    echo
    echo "This script resizes all images in directories ending with '_original'"
    echo "within the source folder to the specified dimensions (e.g., 128x128)."
    echo "The resized images are saved in a corresponding directory with the"
    echo "'_original' suffix removed."
    echo
    echo "Arguments:"
    echo "  source_folder       The base folder containing the directories to process."
    echo "  width               The width to which images should be resized."
    echo "  height              The height to which images should be resized."
    echo
    echo "Options:"
    echo "  --help              Display this help message and exit."
}

# Check if --help is provided as an argument
if [[ "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Check if three arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Error: Three arguments are required."
    show_help
    exit 1
fi

# Assign arguments to variables
WIDTH=$1
HEIGHT=$2
BASE_FOLDER=$3

# Check if the base folder exists
if [ ! -d "$BASE_FOLDER" ]; then
    echo "Error: Base folder '$BASE_FOLDER' does not exist."
    exit 1
fi

# Process each directory that ends with '_original'
for DIR in "$BASE_FOLDER"/*_original; do
    if [ -d "$DIR" ]; then
        # Compute destination directory by removing '_original' suffix
        DEST_DIR="${DIR%_original}"

        # Remove and recreate destination directory
        rm -rf "$DEST_DIR"
        mkdir -p "$DEST_DIR"

        # Process all images in the directory
        echo "Processing images in $DIR to $DEST_DIR at ${WIDTH}x${HEIGHT}px"
        node ./utils/resize.js "$DIR" "$DEST_DIR" "$WIDTH" "$HEIGHT"
    fi
done

echo "Image resizing completed."
