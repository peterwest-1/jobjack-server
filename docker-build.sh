#!/bin/bash

# Check if the Git working directory is clean
if [[ -z $(git status --porcelain) ]]; then
 
    version=$(npm version patch)

    # Extract the version number from the output
    newVersion=$(echo "$version" | cut -d " " -f 3)

    # Print the new version number
    echo "New version: $newVersion"

    # You can use the $newVersion variable in your script as needed
    docker build . -t peterwest86/jobjack-server:$newVersion
else
   echo "Working directory not clean"
fi

exit 0