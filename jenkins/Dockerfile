FROM docker:cli AS docker-client

FROM jenkins/jenkins:lts
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=docker-client /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker-client /usr/local/libexec/docker/cli-plugins/ /usr/local/libexec/docker/cli-plugins/
USER jenkins
