FROM sendy-docker-local.jfrog.io/node:10.24.0-alpine AS BUILD

ARG DOCKER_ENV
ARG VUE_APP_PORTAL
ARG VUE_APP_PARTNER_BFF
ARG VUE_APP_GOOGLE_CLIENT_ID
ENV DOCKER_ENV=$DOCKER_ENV
ENV VUE_APP_PORTAL=$VUE_APP_PORTAL
ENV VUE_APP_PARTNER_BFF=$VUE_APP_PARTNER_BFF
ENV VUE_APP_GOOGLE_CLIENT_ID=$VUE_APP_GOOGLE_CLIENT_ID

WORKDIR /build

COPY package*.json ./

RUN npm install

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
