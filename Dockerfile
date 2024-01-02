FROM oven/bun:latest
COPY . .
ENTRYPOINT ["bun",  "./src/index.ts"]