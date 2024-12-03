# ARG NODE_VERSION=lts-alpine

#FROM docker.io/node:$NODE_VERSION AS deps
FROM node:hydrogen-alpine AS deps
# RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY dist/apps/account/package*.json ./
COPY apps/account/prisma ./prisma

RUN npm install --omit=dev
RUN npm install --dev prisma
RUN npx prisma generate

#FROM docker.io/node:$NODE_VERSION AS runner
FROM node:hydrogen-alpine AS runner
# RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=deps /urs/src/app/prisma ./prisma
COPY dist/apps/account .
RUN chown -R node:node .
USER node
EXPOSE 3000
ENV DOCKER=true
CMD ["dumb-init", "node", "main.js"]
