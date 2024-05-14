#!/bin/bash
# Start script for accounts-filing-web
# npm i
PORT=3000
export NODE_PORT=${PORT}
exec npm run dev -- ${PORT}