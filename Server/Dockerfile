FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install && npm install typescript -g

COPY . .

EXPOSE 8080

RUN tsc

CMD ["sh", "-c", "npm run dev"]