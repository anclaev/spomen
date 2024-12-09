FROM node:18-alpine AS base
RUN npm install -g prisma

FROM base AS deps
WORKDIR /app

COPY dist/apps/oauth/package.json ./
COPY dist/apps/oauth/yarn.lock ./
COPY apps/oauth/prisma ./prisma

RUN npm install --omit=dev --force --silent
RUN npx prisma generate

FROM base AS runner
WORKDIR /app

USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY dist/apps/oauth .

ENV DOCKER=true

CMD ["sh", "-c", "npx prisma db push && node main.js"]
