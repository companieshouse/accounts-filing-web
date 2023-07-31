FROM 169942020521.dkr.ecr.eu-west-2.amazonaws.com/base/node-16:16-alpine-builder
FROM 169942020521.dkr.ecr.eu-west-2.amazonaws.com/base/node-16:16-alpine-runtime

RUN cp -r ./dist/* ./ && rm -rf ./dist

CMD ["/app/server.js","--","3000"]
# CMD . ./config/.env.base && /app/server.js -- 3000

EXPOSE 3000