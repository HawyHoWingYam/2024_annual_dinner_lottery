#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./build.sh <version>"
  exit 1
fi

# Build docker image
docker build -t lottery:${VERSION} .

echo "Build complete: lottery:${VERSION}"