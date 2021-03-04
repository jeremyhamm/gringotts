#!/bin/bash
    
# Nuke all Docker containers, newtworks, volumes and images
nuke () {
  echo "Nuking Docker!"
  docker system prune --all --volumes
}

# Execute docker-compose down
down () {
  echo "Stopping network, containers, images, and volumes..."
  docker-compose down
}

# Execute docker-compose up
up () {
  echo "Building network, containers, images, and volumes..."
  docker-compose up
}

# Execute docker-compose up --build
build () {
  echo "Rebuilding network, containers, images, and volumes..."
  docker-compose up --build
}

"$@"
