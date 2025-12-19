# --- Build Stage ---
FROM node:22.13.1-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22.13.1-slim AS final
WORKDIR /app

# Создаём не-root пользователя
RUN addgroup --system node-group && adduser --system --ingroup node-group node-user

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm ci --only=production

# Копируем другие нужные файлы
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER node-user
EXPOSE 5000

CMD ["node", "dist/server/index.js"]
