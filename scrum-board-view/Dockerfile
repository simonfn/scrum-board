FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install && npm install -g @angular/cli
ENV NODE_ENV=production
COPY . .
EXPOSE 4200
RUN chown -R node /usr/src/app
USER node
CMD ["ng", "serve", "--host", "0.0.0.0"]
