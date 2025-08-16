FROM accetto/ubuntu-vnc-xfce-chromium-g3:latest

USER root

# Node 22をインストール（Ubuntu 22.04ベースなのでOK）
RUN apt-get update && apt-get install -y curl git net-tools \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Playwright アプリのセットアップ
WORKDIR /app
COPY ./playwright /app/playwright
RUN cd /app/playwright && \
    npm install && \
    npx playwright@1.51 install --with-deps chromium
RUN cd /app && \
    git clone --depth 1 --branch v1.6.0 https://github.com/novnc/noVNC.git

# 起動スクリプト作成

COPY ./start.sh /app/start.sh
COPY ./novnc.sh /app/novnc.sh
RUN chmod +x /app/start.sh && \
    chmod +x /app/novnc.sh

EXPOSE 3001 5901 6901 6080

CMD ["/bin/bash", "-c", "/app/start.sh & /app/novnc.sh"]
