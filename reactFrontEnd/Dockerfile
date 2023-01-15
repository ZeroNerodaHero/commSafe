FROM node:19-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN rm -rf node_modules
RUN npm install 
EXPOSE 3000
CMD ["npm","start"]
