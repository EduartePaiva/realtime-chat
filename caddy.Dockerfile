FROM node:24-slim AS front
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./apps/frontend /app
WORKDIR /app

ENV VITE_API_URL=""

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM caddy:2.11-alpine AS caddy

COPY Caddyfile /app/
COPY --from=front /app/dist /var/www/html
WORKDIR /app
RUN caddy adapt --config Caddyfile --validate
CMD [ "caddy", "run" ]
 