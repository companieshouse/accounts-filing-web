FROM node:18
# COPY api-enumerations ./api-enumerations
RUN cp -r ./dist/* ./ && rm -rf ./dist
CMD ["/app/bin/www.js","--","3000"]
EXPOSE 3000