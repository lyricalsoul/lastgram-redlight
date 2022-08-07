FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache g++ make

COPY package*.json ./
RUN npm ci --only=production --omit=dev
COPY . .
EXPOSE 3000

CMD [ "node", "index.js"]
