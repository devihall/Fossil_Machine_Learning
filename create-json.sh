#!/bin/bash

echo "Script started with argument: $1"

# Function to create JSON dataset
createDatasetJson() {
    local lastFolderName=$1
    echo "Creating dataset for: $lastFolderName"

    local baseDir="./public/images/dataSets/${lastFolderName}"
    local dataset=()
    local jsonFileName="${lastFolderName}.json"

    # Check if the base directory exists
    if [[ ! -d "$baseDir" ]]; then
        echo "Directory not found: $baseDir"
        exit 1
    fi

    # Navigate to the base directory
    cd "$baseDir"

    # Loop through each category directory
    for categoryDir in */; do
        if [[ -d "$categoryDir" ]]; then
            # Navigate into the category directory
            cd "$categoryDir"

            # Loop through each file in the category directory
            for file in *; do
                if [[ -f "$file" ]]; then
                    # Build the file path and add it to the dataset array
                    local filePath="/images/dataSets/${lastFolderName}/${categoryDir%/}/${file}"
                    dataset+=("{\"image\": \"${filePath//\\/\/}\", \"category\": \"${categoryDir%/}\"}")
                fi
            done

            # Navigate back to the base directory
            cd ..
        fi
    done

    # Write the dataset array to a JSON file
    echo "[" > "../$jsonFileName"
    echo "${dataset[*]}" | sed 's/} {/},\n{/g' >> "../$jsonFileName"
    echo "]" >> "../$jsonFileName"

    echo "Dataset JSON created: ${jsonFileName}"
}

# Call the function with the folder name
createDatasetJson "$1"