FROM node:14

WORKDIR /home/runner/work/avni-webapp/avni-webapp
RUN echo "REACT_APP_COGNITO_IN_DEV=true; then\nREACT_APP_AWS_REGION=ap-south-1; then\nREACT_APP_COGNITO_USER_POOL_ID=ap-south-1_hWEOvjZUH; then\nREACT_APP_COGNITO_APP_CLIENT_ID=7dbsrgg56mptr4ue1g65nv3s86;" > .env.development.local

COPY .env.development.local ./

COPY package*.json ./

RUN yarn install
COPY . .

EXPOSE 6010

CMD ["yarn" , "start"]