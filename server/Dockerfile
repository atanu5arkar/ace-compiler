FROM node:20

RUN apt-get update && apt-get install -y \
    gcc \
    ruby \
    default-jdk \
    time

WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/

EXPOSE 8080

# RUN useradd -u 1000 -m -r compileruser && chown -R compileruser:compileruser /app
RUN chown -R node:node /app
USER node

CMD npm start