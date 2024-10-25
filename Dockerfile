# Base image
FROM --platform=amd64 ubuntu:20.04

WORKDIR /app
# Set environment to prevent prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install necessary packages
RUN apt-get update && apt-get install -y \
    xvfb \
    x11vnc \
    x11-utils \
    dbus-x11 \
    xfonts-base \
    wget \
    python3 \
    python3-pip \
    tzdata \
    curl \
    && rm -rf /var/lib/apt/lists/*

# PPTR Deps 
RUN apt-get update && \
    apt-get install -y wget curl gnupg fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libatspi2.0-0 libcairo2 libcups2 libgbm1 libglib2.0-0 libgtk-3-0 libnspr4 \
    libnss3 libpango-1.0-0 libxkbcommon0 xdg-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Install nodejs LTS and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

# Set environment variable to avoid issues with some apps expecting a display
ENV DISPLAY=:99

COPY ./package.json .
RUN npm i

COPY ./bot.js .

# Start Xvfb
CMD Xvfb :99 -screen 0 1024x768x24 -ac & node bot.js
