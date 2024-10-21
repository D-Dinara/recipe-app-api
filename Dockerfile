FROM python:3.9-alpine3.13
LABEL maintainer="ddinara" 

ENV PYTHONUNBUFFERED=1

# Install ca-certificates
RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./app /app
WORKDIR /app
EXPOSE 8000

ARG DEV=false
# Create virtual environment and install Python dependencies with trusted hosts
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
      then /py/bin/pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp && \
    adduser \
      --disabled-password \
      --no-create-home \
      django-user

ENV PATH="/py/bin:$PATH"

USER django-user
