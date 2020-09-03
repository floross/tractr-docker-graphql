# ---- Base Node ----
FROM mhart/alpine-node:14 AS base

# set working directory
WORKDIR /root/tractr

# copy project file
COPY package.json  .
COPY tsconfig.json  .
COPY tsconfig.build.json  .
COPY schema.gql .
COPY yarn.lock .
COPY prisma ./prisma


# ---- Production Dependencies ----
FROM base AS dependencies.prod
RUN yarn --production
RUN yarn prisma generate

# ---- Dependencies ----
FROM dependencies.prod AS dependencies.dev
RUN yarn

# ---- Dependencies ----
FROM dependencies.dev AS build
COPY src ./src
RUN yarn prebuild
RUN yarn build

#
# ---- Release ----
FROM dependencies.prod AS release
COPY --from=build /root/tractr/dist ./dist

# expose port and define CMD
EXPOSE 400
CMD yarn start:prod