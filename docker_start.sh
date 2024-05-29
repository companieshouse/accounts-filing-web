#!/bin/bash
# Start script for accounts-filing-web

if [ ! -d "node_modules" ]; then
    echo "node_modules directory does not exist. Attempting to install dependencies..."
    if ! npm install; then
        echo "npm install failed or timed out. Please run 'npm install' in the accounts-filing-web directory manually before starting the service."
        exit 1
    fi
fi

echo "Starting the accounts-filing-web service..."
npm run dev