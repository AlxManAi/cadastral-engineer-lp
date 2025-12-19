# Этап: базовый образ с Node.js 20
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Этап: сборка (устанавливаем все зависимости, включая dev)
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Финальный образ: только production-зависимости и собранный dist
FROM base
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
EXPOSE 5000
CMD ["npm", "start"]
