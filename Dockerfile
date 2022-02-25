# Build stage
FROM node:16-alpine AS builder

WORKDIR /opt/api

COPY package.json /opt/api/package.json
COPY yarn.lock /opt/api/yarn.lock

RUN yarn install

COPY src/ /opt/api/src/
COPY tsconfig.json /opt/api/tsconfig.json

RUN yarn build

# Execute stage
FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /opt/api
COPY package.json /opt/api/package.json
COPY yarn.lock /opt/api/yarn.lock

COPY --from=builder /opt/api/build /opt/api/build

RUN yarn install --prod

EXPOSE 80/tcp
EXPOSE 443/tcp

CMD yarn start