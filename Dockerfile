FROM node:14-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run generate

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/
