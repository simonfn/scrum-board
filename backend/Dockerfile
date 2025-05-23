FROM python:latest
RUN mkdir -p /app
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache -r requirements.txt && \
    pip install "fastapi[standard]"
COPY . .
EXPOSE 8000
CMD ["fastapi", "run", "app.py"]
