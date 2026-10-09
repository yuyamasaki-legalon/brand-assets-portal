FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY server.mjs cms-seed.json ./
COPY public ./public
ENV NODE_ENV=production PORT=8080 CMS_STATIC_DIR=/app/public CMS_SEED_PATH=/app/cms-seed.json CMS_DATA_DIR=/data
EXPOSE 8080
CMD ["node", "server.mjs"]
