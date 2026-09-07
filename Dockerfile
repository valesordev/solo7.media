# Builds this site into a static image that runs anywhere — the local kind
# cluster at solo7.valesordev.com, or a cloud cluster later. Self-contained on
# purpose: the build happens here, so nothing outside needs a Node toolchain.
#
# @valesordev/ui comes from GitHub Packages, so `npm ci` needs credentials. They
# are mounted as a BuildKit secret rather than copied in, so the token never
# lands in a layer:
#
#   DOCKER_BUILDKIT=1 docker build --secret id=npmrc,src=$HOME/.npmrc -t <tag> .

# Node 22 matches this repo's GitHub Actions. On newer Node, npm silently skips
# Astro's optional `sharp` dependency and the build fails on an unresolved
# import that says nothing about Node versions.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc,required=false \
    if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

# Faro config, so the image carries the same instrumentation the Pages build
# does. Passed as build args rather than baked in: the keys are not secrets
# (they ship to the browser) but they stay out of source. Absent values make the
# site's Faro init a graceful no-op, so an un-instrumented build still works.
#
#   --build-arg PUBLIC_FARO_APPS="$(gh variable get FARO_APPS)"
ARG PUBLIC_FARO_APPS=""
ARG PUBLIC_FARO_ENDPOINT="https://faro-collector-prod-us-central-0.grafana.net/collect"
ARG PUBLIC_FARO_APP_VERSION=""
ENV PUBLIC_FARO_APPS=$PUBLIC_FARO_APPS \
    PUBLIC_FARO_ENDPOINT=$PUBLIC_FARO_ENDPOINT \
    PUBLIC_FARO_APP_VERSION=$PUBLIC_FARO_APP_VERSION

COPY . .
RUN npm run build

# nginx-unprivileged listens on 8080 as uid 101, which is what the cluster's
# securityContext expects (runAsUser 101, read-only root, no capabilities).
# Pinned by digest; bumping it is a commit.
FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
