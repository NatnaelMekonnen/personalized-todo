#!/bin/bash

declare -a services=("backend" "frontend")

# Function to stop all services when Ctrl+C is pressed
function stop_services {
  for service in "${services[@]}"; do
    pkill -f "npm run dev --prefix $service"
  done
  exit 0
}

# Trap Ctrl+C to call the stop_services function
trap stop_services INT

for service in "${services[@]}"; do
  cd $service
  npm run dev &
  cd ..
done

# Keep the script running until Ctrl+C is pressed
while true; do
  sleep 1
done