FROM node:14

WORKDIR /home/runner/work/avni-webapp/avni-webapp

COPY package*.json ./

RUN yarn install
RUN yarn upgrade

COPY . .

EXPOSE 6010

CMD ["yarn" , "start"]