FROM public.ecr.aws/bitnami/node:latest

RUN mkdir /usr/share/backend

WORKDIR /usr/share/backend
COPY . .
RUN npm install --unsafe-perm=true
RUN node ace build --production
COPY .env ./build/.env
WORKDIR /usr/share/backend/build
RUN npm ci --production --unsafe-perm

EXPOSE 3333

CMD ["sh", "-c", "node server.js"]