FROM node:10-alpine as base
ENV NODE_ENV=production

RUN mkdir -p /node/app/node_modules
WORKDIR /node/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production \
    && yarn cache clean --force
ENV PATH=/node/app/node_modules/.bin:$PATH

FROM base as dev
ENV NODE_ENV=development
RUN yarn install
CMD [ "/node/app/node_modules/.bin/nodemon" ]

FROM dev as build
COPY . .
RUN tsc

FROM base as prod
# Copy compiled code
COPY --from=build /node/app/dist .
CMD [ "node", "server.js" ]

FROM dev as test
ENV NODE_ENV=test
CMD [ "npm", "test" ]
