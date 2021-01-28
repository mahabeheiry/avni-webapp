FROM node:14

WORKDIR /home/runner/work/avni-webapp/avni-webapp

COPY ./start.sh /

COPY package*.json ./

RUN yarn install

RUN chmod +x /start.sh

COPY . .

EXPOSE 6010

CMD ["/start.sh"]