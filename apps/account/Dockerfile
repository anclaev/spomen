ARG NODE_VERSION=lts-alpine

# Install dependencies only when needed
FROM docker.io/node:$NODE_VERSION AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY dist/apps/account/package*.json ./
COPY apps/account/schema.prisma ./
RUN npm install --omit=dev
RUN npm install --dev prisma
RUN npx prisma generate

# Production image, copy all the files and run nest
FROM docker.io/node:$NODE_VERSION AS runner
RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY dist/apps/account .
RUN chown -R node:node .
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]
