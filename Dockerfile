# ------------------------------------------------------------
# Multi-stage build for the Next.js app.
# Base image: platformatic/node-caged:26-alpine — Node.js with
# V8 pointer compression enabled (~50% memory reduction for
# pointer-heavy workloads). See https://hub.docker.com/r/platformatic/node-caged
#
# Requires `output: "standalone"` in next.config.mjs so the `runner`
# stage can ship a tiny server bundle without node_modules.
# ------------------------------------------------------------

# Base: shared Node + pnpm toolchain. Pin pnpm to match `packageManager`
# in package.json for reproducible builds.
FROM platformatic/node-caged:26-alpine AS base
ENV PNPM_VERSION=11.9.0 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /webapp
RUN npm install -g pnpm@${PNPM_VERSION}

# deps: install all dependencies from the lockfile (cached layer)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# builder: compile the Next.js app
FROM base AS builder
COPY --from=deps /webapp/node_modules ./node_modules
COPY . .
RUN pnpm build

# runner: minimal production image, runs the standalone server
FROM platformatic/node-caged:26-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /webapp

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copy the standalone output and its required static assets.
# `.next/standalone` already contains a pruned node_modules subset.
COPY --from=builder --chown=nextjs:nodejs /webapp/public ./public
COPY --from=builder --chown=nextjs:nodejs /webapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /webapp/.next/static ./.next/static
# SKILL.md is read at runtime by app/skill.md/route.ts via process.cwd()
COPY --from=builder --chown=nextjs:nodejs /webapp/SKILL.md ./SKILL.md

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
