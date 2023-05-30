#!/bin/bash

if [[ -z $(git status --porcelain) ]]; then
 
    version=$(npm version patch)

    updated=$(echo "$version" | cut -d " " -f 3)

    echo "New version: $updated"

    docker build . -t peterwest86/jobjack-server:$updated
    docker tag peterwest86/jobjack-server:$updated peterwest86/jobjack-server:latest
else
   echo "Working directory not clean"
fi

exit 0