FROM node:lts-alpine3.16
USER root
RUN apk add --no-cache bash sudo
RUN corepack enable
RUN yarn global add @nestjs/cli
RUN mkdir -p /etc/sudoers.d \
   && echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node \
   && chmod 0440 /etc/sudoers.d/node
USER node
WORKDIR /home/node/app
