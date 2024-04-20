#!/bin/bash

# Check for the correct number of arguments
if [ $# -ne 3 ]; then
    echo "Usage: $0 <config_path> <key> <value>"
    exit 1
fi

CONFIG_PATH="$1"
KEY="$2"
VALUE="$3"

# Ensure the configuration file exists or create it if it doesn't
if [ ! -f "$CONFIG_PATH" ]; then
    touch "$CONFIG_PATH"
fi

# Update or add the configuration
grep -q "^${KEY}==" "$CONFIG_PATH"
if [ $? -eq 0 ]; then
    # Key exists, update the value
    sed -i '' "s|^${KEY}==.*|${KEY}==${VALUE}|" "$CONFIG_PATH"
else
    # Key does not exist, add it
    echo "${KEY}==${VALUE}" >> "$CONFIG_PATH"
fi

echo "Configuration updated successfully"
