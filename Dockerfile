FROM node:alpine AS BUILD

ARG DOCKER_ENV
ARG VUE_APP_PORTAL
ARG VUE_APP_PARTNER_BFF
ARG MAPS_API_KEY
ARG MIX_PANEL_TOKEN
ARG VUE_APP_CONVOY_API

ENV DOCKER_ENV=$DOCKER_ENV
ENV VUE_APP_PORTAL=$VUE_APP_PORTAL
ENV VUE_APP_PARTNER_BFF=$VUE_APP_PARTNER_BFF
ENV MAPS_API_KEY=$MAPS_API_KEY
ENV MIX_PANEL_TOKEN=$MIX_PANEL_TOKEN
ENV VUE_APP_CONVOY_API=$VUE_APP_CONVOY_API

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn run build

#################################################################################################
FROM sendy-docker-local.jfrog.io/nginx:base_frontend

WORKDIR /usr/src/app

COPY --from=BUILD /build/dist ./

COPY  nginx/default.conf  /etc/nginx/conf.d/
COPY  nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
