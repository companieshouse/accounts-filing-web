FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-18
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/local/configure-local-ssh


RUN dnf install -y tar

COPY --from=0 ./ ./

WORKDIR /opt

COPY . .

CMD [ "./docker_start.sh" ]

EXPOSE 3000

