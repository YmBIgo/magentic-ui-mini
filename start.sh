#!/usr/bin/env bash
set -e

# ベースイメージのVNC起動スクリプトを呼び出し
/dockerstartup/startup.sh &
VNC_PID=$!

# VNCサーバーの起動を待つ
echo "Waiting for VNC server..."
for i in {1..30}; do
    if netstat -ln | grep -q ':5901'; then
        echo "VNC server is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

chromium-browser \
  --no-sandbox \
  --remote-debugging-address=0.0.0.0 \
  --remote-debugging-port=9200 \
  --disable-dev-shm-usage \
  --disable-gpu \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/chrome-user-data \
  >/tmp/chromium.log 2>&1 &

CHROMIUM_PID=$!
echo "Chromium started (PID=$CHROMIUM_PID)"

sleep 10
curl -s http://127.0.0.1:9200/json/version || {
    echo "CDP not reachable"
    exit 1
}

echo "Starting Playwright app..."
cd /app/playwright
exec npm run start
