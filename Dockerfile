FROM node:slim

WORKDIR /usr/src/app

COPY package*.json ./

COPY requirements.txt ./

COPY wait-for-it.sh /wait-for-it.sh

USER root

RUN apt-get update -y && apt-get dist-upgrade -y && apt-get autoremove -y
RUN apt-get install -y python3 python3-pip && pip3 install --upgrade pip
RUN npm install && pip3 install -r requirements.txt && chmod 755 /wait-for-it.sh

COPY . .