# Build frontend
FROM node:18 as frontend-build
WORKDIR /app
COPY . .
RUN npm run install-all
RUN npm run build

# Production environment
FROM node:18-slim
WORKDIR /app
COPY --from=frontend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/dist ./backend/dist
COPY --from=frontend-build /app/package*.json ./
RUN npm install --production

EXPOSE 5000
CMD ["npm", "start"]