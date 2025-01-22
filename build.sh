#!/bin/bash

VERSION=$1
IMAGE_NAME="karasho62/hyakunousha_lottery_application"

# Version validation
if [ -z "$VERSION" ]; then
  echo "Usage: ./build.sh <version>"
  exit 1
fi

echo "Building Docker image for AMD64..."
echo "Image: ${IMAGE_NAME}:${VERSION}"

# Ensure buildx is available
docker buildx version >/dev/null 2>&1 || { 
  echo "Error: docker buildx not available"
  exit 1
}

# Build for AMD64
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t ${IMAGE_NAME}:${VERSION} \
  .

if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "Image: ${IMAGE_NAME}:${VERSION}"
  docker images | grep ${IMAGE_NAME}
else
  echo "Build failed!"
  exit 1
fi