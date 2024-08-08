FROM node:alpine as build

WORKDIR /app 

COPY notes-front/package*.json ./ 

RUN npm cache clean --force
RUN npm install

COPY notes-front/. . 

RUN npm run build

# Второй этап: копируем собранные файлы в nginx
FROM nginx:alpine

# Копируем статические файлы в директорию, которую nginx будет обслуживать
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY notes-front/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Указываем команду по умолчанию для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]