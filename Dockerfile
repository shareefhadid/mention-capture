# FROM node:current-alpine3.12
FROM shareefhadid/node-3-12-and-python-3-test1

WORKDIR /usr/src/app

COPY package*.json ./

COPY requirements.txt ./

COPY wait-for-it.sh /wait-for-it.sh

USER root

# alpine packages: https://pkgs.alpinelinux.org/packages
RUN apk add --update --no-cache g++ gcc libxslt-dev py-lxml bash && npm install && pip install -r requirements.txt && chmod 755 /wait-for-it.sh

COPY . .