FROM node:12.17.0-buster-slim as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build 

FROM nginx:1.19.0-alpine
EXPOSE 300
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
