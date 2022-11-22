FROM node:16.14-alpine
RUN apk update && apk add bash
WORKDIR /app

COPY . .

RUN yarn && yarn build

CMD ["yarn", "start"]