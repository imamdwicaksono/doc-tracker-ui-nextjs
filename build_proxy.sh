#!/bin/bash

APP_NAME="proxy"

PLATFORMS=("windows/amd64" "linux/amd64" "darwin/amd64" "linux/arm64" "windows/arm64")

mkdir -p proxy-builds

for PLATFORM in "${PLATFORMS[@]}"
do
    GOOS=${PLATFORM%/*}
    GOARCH=${PLATFORM#*/}

    OUTPUT_NAME=$APP_NAME"-"$GOOS"-"$GOARCH
    if [ "$GOOS" = "windows" ]; then
        OUTPUT_NAME+=".exe"
    fi

    echo "🔧 Building for $GOOS/$GOARCH..."
    env GOOS=$GOOS GOARCH=$GOARCH go build -o proxy-builds/$OUTPUT_NAME proxy.go

    if [ $? -ne 0 ]; then
        echo "❌ Build failed for $GOOS/$GOARCH"
        exit 1
    else
        echo "✅ Built: proxy-builds/$OUTPUT_NAME"
    fi
done

echo "📦 Packaging builds into zip files..."
for PLATFORM in "${PLATFORMS[@]}"
do
    GOOS=${PLATFORM%/*}
    GOARCH=${PLATFORM#*/}   
    OUTPUT_NAME=$APP_NAME"-"$GOOS"-"$GOARCH
    if [ "$GOOS" = "windows" ]; then
        OUTPUT_NAME+=".exe"
    fi
    ZIP_NAME=$OUTPUT_NAME".zip"

    echo "📦 Packaging build into zip file: $ZIP_NAME"
    # Copy .env file next to the binary for packaging if it exists
    if [ -f .env.proxy ]; then
        zip -j "proxy-builds/$ZIP_NAME" "proxy-builds/$OUTPUT_NAME" ".env.proxy"
    else
        zip -j "proxy-builds/$ZIP_NAME" "proxy-builds/$OUTPUT_NAME"
    fi
done




echo "🎉 All builds completed!"
