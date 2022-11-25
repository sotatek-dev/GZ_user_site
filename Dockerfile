FROM 983383401906.dkr.ecr.us-east-1.amazonaws.com/node:16.14
RUN apk update && apk add bash
WORKDIR /app

COPY . .

RUN yarn && yarn build

CMD ["yarn", "start"]
