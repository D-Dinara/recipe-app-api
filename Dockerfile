FROM python:3.9-alpine3.13
LABEL maintainer="ddinara" 

ENV PYTHONUNBUFFERED=1  

ADD ./cert/zscaler_root.crt /usr/local/share/ca-certificates/zscaler_root.crt
ADD ./cert/zscaler_intermediate.crt /usr/local/share/ca-certificates/zscaler_intermediate.crt
ENV NODE_OPTIONS=--use-openssl-ca
ENV PIP_CERT=/etc/ssl/certs/ca-certificates.crt
RUN update-ca-certificates --fresh

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./app /app
WORKDIR /app
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
  /py/bin/pip install --upgrade pip && \
  apk add --update --no-cache postgresql-client && \
  apk add --update --no-cache --virtual .tmp-build-deps \
    build-base postgresql-dev musl-dev && \
  /py/bin/pip install -r /tmp/requirements.txt && \
  if [ $DEV = "true" ]; \
    then /py/bin/pip install -r /tmp/requirements.dev.txt ; \
  fi && \
  rm -rf /tmp && \
  apk del .tmp-build-deps && \
  adduser \
    --disabled-password \
    --no-create-home \
    django-user

ENV PATH="/py/bin:$PATH"

USER django-user