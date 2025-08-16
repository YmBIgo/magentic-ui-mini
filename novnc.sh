#!/usr/bin/env bash
set -e

# VNCサーバーの起動を待つ
echo "Waiting for VNC server to be ready..."
for i in {1..30}; do
    if netstat -ln | grep -q ':5901'; then
        echo "VNC server is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

cd /app/noVNC
./utils/novnc_proxy --vnc localhost:5901 --listen 6080 --web .
