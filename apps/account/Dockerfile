FROM node:hydrogen-alpine AS deps
WORKDIR /usr/src/app
COPY dist/apps/account/package*.json ./
COPY apps/account/prisma ./prisma
RUN npm install --omit=dev --force
RUN npm install --dev prisma --force
RUN npx prisma generate

FROM node:hydrogen-alpine AS runner
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=deps /usr/src/app/prisma ./prisma
COPY dist/apps/account .
USER node
EXPOSE 3000
ENV DOCKER=true
CMD ["node", "main.js"]
