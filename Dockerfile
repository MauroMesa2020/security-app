
# ---------- 1. Compilar React ----------
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY ui-react/package*.json ./
RUN npm ci

COPY ui-react/ ./
RUN npm run build


# ---------- 2. Aplicación Python ----------
FROM python:3.12-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

# Verificar que Semgrep esté instalado
RUN semgrep --version

COPY app.py ./
COPY src/ ./src/

# Frontend compilado
COPY --from=frontend-build /frontend/dist ./ui-react/dist

# Directorio donde se montarán los proyectos persistentes
RUN mkdir -p /app/web-sites

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "1800", "app:app"]
