# syntax=docker/dockerfile:1

# --- Stage 1: rebuild tailwind.output.css so the image never ships a stale stylesheet ---
# Standalone CLI binaries are glibc builds, so this stage cannot be Alpine.
FROM debian:bookworm-slim AS css

ARG TAILWIND_VERSION=3.4.17
ARG TARGETARCH

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

RUN case "${TARGETARCH:-amd64}" in \
      amd64) arch=x64 ;; \
      arm64) arch=arm64 ;; \
      *) echo "Unsupported arch: ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
 && curl -fsSL -o /usr/local/bin/tailwindcss \
      "https://github.com/tailwindlabs/tailwindcss/releases/download/v${TAILWIND_VERSION}/tailwindcss-linux-${arch}" \
 && chmod +x /usr/local/bin/tailwindcss

WORKDIR /src
COPY . .
RUN tailwindcss -c tailwind.config.js -i tailwind.input.css -o tailwind.output.css --minify

# --- Stage 2: serve the static files ---
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=css /src/*.html /src/*.js /src/*.css /src/logo.png ./
# Build inputs only — not something the browser should fetch.
RUN rm -f tailwind.config.js tailwind.input.css

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
