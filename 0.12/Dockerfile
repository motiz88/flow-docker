FROM buildpack-deps:jessie-curl
ENV FLOW_VERSION 0.12.0

RUN apt-get update \
	&& apt-get install -y unzip libelf1 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
	&& curl -SLO "https://github.com/facebook/flow/releases/download/v$FLOW_VERSION/flow-linux64-v$FLOW_VERSION.zip" \
	&& unzip "flow-linux64-v$FLOW_VERSION.zip" -d /usr/local \
	&& rm "flow-linux64-v$FLOW_VERSION.zip"


ENV PATH /usr/local/flow:$PATH

VOLUME /app
WORKDIR /app

CMD ["flow", "check"]
