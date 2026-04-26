FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --only=production
RUN npx prisma generate

# Build
FROM base AS builder
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 kprapi
USER kprapi

COPY --from=builder --chown=kprapi:nodejs /app/dist ./dist
COPY --from=deps --chown=kprapi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=kprapi:nodejs /app/prisma ./prisma
COPY --from=deps --chown=kprapi:nodejs /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
