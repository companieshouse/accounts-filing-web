FROM node:18-bookworm

WORKDIR /opt

COPY . . 

CMD ["./docker_start.sh"]

EXPOSE 3000
