# Dev: Vite dev server con HMR. El código se monta por volumen en compose.
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 5173
CMD ["npm", "run", "dev"]
