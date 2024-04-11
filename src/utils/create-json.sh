#!/bin/bash

echo "Script started with arguments: $1, $2"

createDatasetJson() {
    local lastFolderName=$1
    local numImagesPerCategory=$2
    echo "Creating dataset for: $lastFolderName, $numImagesPerCategory images per category"

    local baseDir="../public/images/dataSets/${lastFolderName}"
    local dataset=()
    local jsonFileName="${lastFolderName}.json"

    if [[ ! -d "$baseDir" ]]; then
        echo "Directory not found: $baseDir"
        exit 1
    fi

    cd "$baseDir"

    for categoryDir in */; do
        echo "Processing category: $categoryDir"
        if [[ -d "$categoryDir" ]]; then
            cd "$categoryDir"

            # Read filenames into an array, ensuring filenames with spaces are handled as a single entry
            IFS=$'\n' files=($(ls))
            unset IFS

            # echo "Files found: ${files[*]}"

            local selectedFiles=()

            if [[ ${#files[@]} -gt $numImagesPerCategory ]]; then
                IFS=$'\n' selectedFiles=($(shuf -e "${files[@]}" -n "$numImagesPerCategory"))
                unset IFS
                echo "Selected files: ${selectedFiles[*]}"
            else
                selectedFiles=("${files[@]}")
            fi

            for file in "${selectedFiles[@]}"; do
                # echo "Processing file: $file"
                if [[ -f "$file" ]]; then
                    local filePath="images/dataSets/${lastFolderName}/${categoryDir%/}/${file}"
                    # echo "Adding file to dataset: $filePath"
                    dataset+=("{\"image\": \"${filePath}\", \"category\": \"${categoryDir%/}\"}")
                else
                    echo "File not found: $file"
                fi
            done

            cd ..
        fi
    done


    echo "[" > "../$jsonFileName"
    echo "${dataset[*]}" | sed 's/} {/},\n{/g' >> "../$jsonFileName"
    echo "]" >> "../$jsonFileName"

    echo "Dataset JSON created: ${jsonFileName}"
}

createDatasetJson "$1" "$2"
