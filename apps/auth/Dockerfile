# ARG NODE_VERSION=lts-alpine

#FROM scripts.io/node:$NODE_VERSION AS deps
FROM node:hydrogen-alpine AS deps
# RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY dist/apps/auth/package*.json ./
COPY apps/auth/prisma ./prisma

RUN npm install --omit=dev --force
RUN npm install --dev prisma --force
RUN npx prisma generate

#FROM scripts.io/node:$NODE_VERSION AS runner
FROM node:hydrogen-alpine AS runner
# RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=deps /usr/src/app/prisma ./prisma
COPY dist/apps/auth .
# RUN chown -R node:node .
USER node
EXPOSE 3000
ENV DOCKER=true
# CMD ["dumb-init", "node", "main.js"]
CMD ["node", "main.js"]
