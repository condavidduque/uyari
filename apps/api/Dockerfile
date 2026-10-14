FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY apps/api/package.json apps/api/
COPY workers/ingest/package.json workers/ingest/
COPY workers/extract/package.json workers/extract/
COPY workers/live-guide/package.json workers/live-guide/
COPY packages/schemas/package.json packages/schemas/

RUN npm install --workspaces --include-workspace-root

COPY . .

WORKDIR /app/apps/api
CMD ["npm", "run", "dev"]
