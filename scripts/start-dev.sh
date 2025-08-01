#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../" && pwd)"

osascript -e "tell application \"Terminal\" to do script \"cd $ROOT_DIR && npm run dev\""
osascript -e "tell application \"Terminal\" to do script \"cd $ROOT_DIR && node server/index.js\""
