FROM debian:latest

RUN apt update -y && apt upgrade -y && \
    apt install -y gnupg curl && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org

# Set up default working directory
WORKDIR /app

# Expose MongoDB port
EXPOSE 27017

# Start MongoDB
CMD ["mongod", "--dbpath", "/data/db", "--bind_ip_all"]
