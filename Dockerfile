FROM sendy-docker-local.jfrog.io/node:10.24.0-alpine AS BUILD

WORKDIR /build

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

#########################################################################################################
FROM sendy-docker-local.jfrog.io/distroless-nginx-base

WORKDIR /usr/src/app

COPY --from=BUILD /build/dist ./

COPY  nginx/default.conf  /etc/nginx/conf.d/
COPY  nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]