FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src /app/src
RUN mkdir -p /app/backups

ENV PROJECT_ROOT=/app

EXPOSE 8000

CMD ["uvicorn", "src.main.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
