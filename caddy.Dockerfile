FROM node:24-slim AS front
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./apps/frontend /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM caddy:2-alpine AS caddy

COPY ./Caddyfile ./app
COPY --from=front /app/dist /app/dist
WORKDIR /app
RUN caddy adapt
CMD [ "caddy", "run" ]
 