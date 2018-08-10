FROM node:10-alpine

RUN mkdir /freifunk-md-lost-node-notifier
COPY . /freifunk-md-lost-node-notifier

WORKDIR /freifunk-md-lost-node-notifier
RUN npm install

CMD ["node", "index.js"]