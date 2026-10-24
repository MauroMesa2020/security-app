# Security Analysis Platform

A web application for analyzing software projects through **Static Application Security Testing (SAST)** and **Dynamic Application Security Testing (DAST)**. The platform integrates Semgrep and OWASP ZAP into a web interface where users can register projects, launch security scans, and review their results.

This project was built as a practical exercise in full-stack development, application security, REST API design, Docker containerization, reverse proxy configuration, and service scaling.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Security Analysis](#security-analysis)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [What I Practiced](#what-i-practiced)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Useful Docker Commands](#useful-docker-commands)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Disclaimer](#disclaimer)

## Overview

The Security Analysis Platform provides a centralized interface for running security checks against software projects.

Users can register a project and launch one of two analysis modes:

- **Static Analysis:** examines source code for potential security vulnerabilities and coding issues without executing the target application.
- **Dynamic Analysis:** tests a running web application to identify potential vulnerabilities by examining its behavior and responses.

The application combines a React frontend, a Flask REST API, PostgreSQL persistence, and dedicated security scanning tools. Nginx acts as the entry point, routing browser requests to the frontend and API requests to the backend.

The deployment uses Docker Compose to manage the services and their network communication. The Flask API can also be scaled to multiple replicas.

## Features

- **Project Management:** register and manage projects submitted for security analysis.
- **Static Security Analysis:** integrate Semgrep for source-code analysis.
- **Dynamic Security Analysis:** integrate OWASP ZAP for testing running web applications.
- **Results Visualization:** access project analysis results through the web interface by selecting a project's card.
- **REST API:** expose backend endpoints for communication with the frontend.
- **Persistent Storage:** store application data in PostgreSQL.
- **Containerized Deployment:** run the application and supporting services with Docker Compose.
- **Reverse Proxy:** use Nginx as the public entry point for frontend and backend requests.
- **Frontend Separation:** build and serve the React application independently of the Flask API.
- **Backend Scaling:** run multiple Flask/Gunicorn replicas using Docker Compose.
- **Environment-Based Configuration:** configure database credentials and scanner settings through environment variables.

## Security Analysis

### Static Analysis — Semgrep

Static analysis examines source code without executing the target application.

The platform uses **Semgrep** to identify potential security issues according to the rules and configurations used by the scanner. Depending on the selected rules, this can include insecure coding patterns and potentially unsafe function usage.

Semgrep may need network access to retrieve remote rulesets. Its execution also depends on the availability of the relevant rules and the target project's source files.

### Dynamic Analysis — OWASP ZAP

Dynamic analysis examines a running web application by sending requests and analyzing its responses.

The platform integrates **OWASP ZAP (Zed Attack Proxy)** to perform web application security testing. Depending on the configured workflow, this can include crawling the target and actively testing for potential vulnerabilities.

The target must be reachable from the ZAP container. Active scans can generate intrusive requests, so only authorized targets should be tested.

### Viewing Results

Each project is represented by a project card in the frontend.

To inspect a project's analysis results, **click the project card's label**. The interface then provides access to the results associated with that project.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend development |
| Flask | HTTP routes and REST API |
| Gunicorn | Python WSGI application server |
| React | Frontend interface |
| TypeScript | Type-safe frontend development |
| Tailwind CSS | UI styling |
| Vite | Frontend development and production builds |
| Nginx | Frontend web server and reverse proxy |
| Semgrep | Static application security testing (SAST) |
| OWASP ZAP | Dynamic application security testing (DAST) |
| PostgreSQL | Relational database |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |

## Architecture

The deployment separates the frontend, API, and supporting services into containers.

```text
                         USER / BROWSER
                                |
                                v
                     Nginx Reverse Proxy
                         Port 80 (host)
                                |
                   +------------+------------+
                   |                         |
             Frontend requests          /api/* requests
                   |                         |
                   v                         v
           Frontend Nginx              Flask API
             React SPA               Gunicorn workers
                                           |
                                 +---------+---------+
                                 |         |         |
                                 v         v         v
                              Semgrep  OWASP ZAP  PostgreSQL
                              (SAST)    (DAST)    (Database)
```

### Component Responsibilities

- **Nginx Reverse Proxy:** receives incoming HTTP requests and routes frontend requests to the frontend container and `/api/` requests to the Flask service.
- **Frontend Container:** serves the production React application built with Vite through Nginx.
- **Flask API:** handles application requests, coordinates security analysis workflows, and communicates with PostgreSQL and OWASP ZAP.
- **Gunicorn:** runs the Flask application in the backend container.
- **Semgrep:** performs static source-code analysis from the backend environment.
- **OWASP ZAP:** performs dynamic security testing against reachable web applications.
- **PostgreSQL:** stores persistent application data.
- **Docker Compose:** defines the services, networks, volumes, dependencies, and deployment configuration.

### Docker Networks

The deployment uses two Docker networks:

- **`frontend-network`:** connects the reverse proxy to the frontend.
- **`backend-network`:** connects the reverse proxy, Flask API replicas, PostgreSQL, and OWASP ZAP.

The frontend container is not directly attached to the backend network. The Flask API does not need a published host port because Nginx communicates with it through the Docker network.

The backend network is not configured as an internal-only network. This allows containers on that network to access external resources when Docker networking and DNS are functioning correctly, which is relevant when Semgrep needs to download rules.

### Scaling the Backend

The Flask service can be started with multiple replicas:

```bash
docker compose up -d --scale app=3
```

Docker Compose creates three containers for the `app` service. Nginx can forward requests to the backend service through Docker's service discovery.

The replicas share the PostgreSQL service and the configured host-mounted project directory. OWASP ZAP remains a single shared service in this Compose configuration.

Scaling the Flask service does not automatically scale PostgreSQL or ZAP. Concurrent scans and shared resources may require additional coordination as the application grows.

## What I Practiced

### Full-Stack Development

- Building a frontend with React, TypeScript, and Tailwind CSS.
- Developing backend endpoints with Flask.
- Connecting frontend components to a REST API.
- Separating frontend, backend, and service responsibilities.

### API Design and Service Integration

- Designing REST endpoints and handling HTTP requests and responses.
- Integrating external security tools into backend workflows.
- Handling long-running operations, timeouts, execution status, and errors.
- Coordinating communication between application components.

### Application Security

- Understanding the differences between SAST and DAST.
- Integrating Semgrep and OWASP ZAP into a single application workflow.
- Configuring scanner access and API authentication.
- Understanding the requirements and limitations of automated security scanning.

### Databases

- Integrating PostgreSQL with a Python backend.
- Managing database connection settings through environment variables.
- Persisting database data independently of the application containers.
- Sharing database access across multiple backend replicas.

### Docker and Deployment

- Creating Docker images for frontend and backend components.
- Using a multi-stage Docker build for the React frontend.
- Running multiple services with Docker Compose.
- Scaling the backend with multiple container replicas.
- Using Docker service names for inter-container communication.
- Configuring ports, networks, environment variables, volumes, and service dependencies.
- Publishing and deploying a backend image through Docker Hub.

### Reverse Proxy and Networking

- Configuring Nginx as an entry point for the application.
- Routing requests to separate frontend and backend services.
- Separating frontend and backend network connectivity.
- Understanding the difference between exposing a container port and publishing a host port.
- Troubleshooting container DNS and outbound network access.

### Configuration and Maintainability

- Separating configuration from application code.
- Using `.env` files for local configuration.
- Providing an `.env.example` template without real credentials.
- Organizing the project into frontend and backend modules.

## Installation and Setup

### Prerequisites

Install the following:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine with the Docker Compose plugin.
- Git, if you want to clone the repository.

When using the provided Docker Compose setup, you do not need to install Python, Node.js, PostgreSQL, or OWASP ZAP directly on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/MauroMesa2020/security-app.git
cd security-app
```

If you cloned the repository into a differently named directory, change into that directory instead.

### 2. Configure Environment Variables

Create a local `.env` file from the provided template.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On Linux or macOS:

```bash
cp .env.example .env
```

Open `.env` and configure the required values. For example:

```dotenv
# OWASP ZAP
ZAP_API_KEY=replace_with_a_long_random_api_key
ZAP_API_URL=http://zap:8080
ZAP_TIMEOUT=1800
ZAP_POLL_INTERVAL=2
ZAP_ACTIVE_SCAN=true

# PostgreSQL
POSTGRES_DB=security_analysis
POSTGRES_USER=admin
POSTGRES_PASSWORD=replace_with_a_strong_password
```

The variable names and values must match the application and Compose configuration. The provided Compose file constructs `DATABASE_URL` from the PostgreSQL variables, so a separate `DATABASE_URL` entry is not required for this configuration.

**Important:** Inside Docker Compose, use `zap` and `db` as hostnames for OWASP ZAP and PostgreSQL. These are the service names. Using `localhost` inside a container refers to that container itself.

Use strong credentials and never commit your real `.env` file.

### 3. Download the Published Images

The backend image is published on Docker Hub:

[Docker Hub — mauromesa2020/security-analysis-app](https://hub.docker.com/r/mauromesa2020/security-analysis-app)

Pull the published images:

```bash
docker compose pull
```

The frontend has its own Dockerfile and is built locally from `ui-react/`. The Compose build step will build it when needed.

### 4. Start the Application

To start the application with the default number of backend replicas:

```bash
docker compose up -d --build
```

To run three backend replicas:

```bash
docker compose up -d --build --scale app=3
```

Docker Compose creates the configured containers, networks, and persistent volumes. The database health check helps ensure PostgreSQL is ready before the backend starts. ZAP uses a service-started dependency, which does not necessarily mean that its API is fully ready.

Check the service status:

```bash
docker compose ps
```

### 5. Access the Web Interface

Open:

**http://localhost**

The main Nginx reverse proxy publishes port 80 on the loopback interface of the host. The frontend and backend do not need separate host ports for browser access.

The current configuration is intended for access from the same machine. To allow access from other devices on your local network, you would need to change the Nginx port mapping in `docker-compose.yml` and consider host firewall rules and other security implications.

### 6. Inspect Logs

Follow the backend logs:

```bash
docker compose logs -f app
```

Inspect the reverse proxy and frontend:

```bash
docker compose logs -f nginx
docker compose logs -f frontend
```

Inspect the supporting services:

```bash
docker compose logs -f db
docker compose logs -f zap
```

Press `Ctrl+C` to stop following the logs. This does not stop the containers.

## Configuration

The application uses environment variables to keep configuration separate from source code.

| Variable | Description |
|---|---|
| `ZAP_API_KEY` | API key used to authenticate requests to OWASP ZAP. |
| `ZAP_API_URL` | URL used by the backend to reach the ZAP API. |
| `ZAP_TIMEOUT` | Maximum time allowed for a scan or related operation, according to the backend implementation. |
| `ZAP_POLL_INTERVAL` | Interval between status checks for a running scan, if polling is used. |
| `ZAP_ACTIVE_SCAN` | Controls active scanning when supported by the application. |
| `POSTGRES_DB` | PostgreSQL database name. |
| `POSTGRES_USER` | PostgreSQL username. |
| `POSTGRES_PASSWORD` | PostgreSQL password. |
| `DATABASE_URL` | Database connection string constructed by the current Compose configuration. |

The Flask containers use `http://zap:8080` to communicate with OWASP ZAP. PostgreSQL is available to the backend at `db:5432`.

### Port Exposure

The current Compose configuration publishes only the reverse proxy's HTTP port:

```yaml
ports:
  - "127.0.0.1:80:80"
```

The backend API, PostgreSQL, and ZAP ports are not published on the host. Their ports are available to connected containers through the relevant Docker network.

The frontend's Nginx container serves the React build internally, and the main Nginx container routes requests to it.

### Semgrep Network Access

Semgrep may need external network access to retrieve remote rulesets. If static analysis fails with a DNS error such as `Temporary failure in name resolution`, check Docker's network configuration and whether the backend container can resolve external domains.

A working application registration flow does not necessarily prove that external DNS resolution is working.

## Useful Docker Commands

| Command | Description |
|---|---|
| `docker compose up -d` | Start services in the background. |
| `docker compose up -d --build` | Build services with build configurations and start them. |
| `docker compose up -d --scale app=3` | Run three backend replicas. |
| `docker compose down` | Stop and remove containers and the Compose network. |
| `docker compose ps` | Show service and container status. |
| `docker compose pull` | Pull images referenced by the Compose configuration. |
| `docker compose logs -f app` | Follow backend logs. |
| `docker compose logs -f nginx` | Follow reverse proxy logs. |
| `docker compose exec app sh` | Open a shell in a running backend container. |

### Updating the Application

The Compose configuration references the backend image using the `latest` tag. To retrieve a newly published version and recreate the backend containers:

```bash
docker compose pull app
docker compose up -d --no-deps --force-recreate --scale app=3 app
```

The `latest` tag is mutable; it does not update running containers automatically. You must pull the new image and recreate the containers to use it.

If you change the frontend source code, rebuild the frontend image and recreate its container:

```bash
docker compose up -d --build frontend
```

For reproducible deployments, versioned image tags are preferable to relying exclusively on `latest`.

### Persistent Data

PostgreSQL data is stored in the named volume `postgres_data`, which normally survives container recreation.

Project files are mounted from the host's `./web-sites/` directory into `/app/web-sites` in each backend container. This allows the containers to access the same project directory.

The following command removes the containers and Compose network but normally preserves named volumes and host-mounted files:

```bash
docker compose down
```

**Warning:** The following command also removes Compose-managed named volumes, including the database volume, and can permanently delete stored database data:

```bash
docker compose down -v
```

Use it only when you intentionally want to delete that persistent data.

## Project Structure

The repository is organized approximately as follows:

```text
.
├── app.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .dockerignore
├── .gitignore
├── .env.example
├── README.md
├── nginx/
│   └── default.conf
├── database/
│   └── init/
├── web-sites/
├── src/
│   └── ...
└── ui-react/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.ts
    ├── public/
    │   └── images/
    └── src/
        └── ...
```

- `app.py`: Flask application entry point.
- `src/`: backend modules, database access, and analysis logic.
- `Dockerfile`: instructions for building the Python backend image.
- `docker-compose.yml`: service definitions, networks, volumes, and deployment configuration.
- `requirements.txt`: Python dependencies.
- `nginx/default.conf`: reverse proxy configuration for the main entry point.
- `database/init/`: database initialization scripts.
- `web-sites/`: host directory mounted into the backend containers for project files.
- `ui-react/`: React frontend source code and Vite configuration.
- `ui-react/Dockerfile`: multi-stage build for the frontend production image.
- `ui-react/nginx.conf`: Nginx configuration for serving the React single-page application.
- `.env.example`: template for local environment configuration.

The exact contents of `src/` and `ui-react/src/` depend on the current implementation.

## Future Improvements

Potential directions for extending the project include:

- Adding user authentication and role-based access control.
- Improving scan history, filtering, and comparison between runs.
- Adding more detailed vulnerability reports and export options.
- Introducing asynchronous job processing for long-running scans.
- Preventing conflicting concurrent scans against the shared ZAP instance.
- Adding automated tests and CI/CD workflows.
- Improving logging, monitoring, and error handling.
- Supporting additional static and dynamic security testing tools.
- Adding HTTPS and production-grade reverse proxy security configuration.
- Improving scalability and coordination of shared resources.

These are possible future enhancements, not necessarily features already implemented.

## Disclaimer

This project is intended for educational purposes and authorized security testing.

Only scan applications, repositories, and systems that you own or have explicit permission to test. Active scans can send potentially intrusive requests and may affect the availability or behavior of the target application.

Configure OWASP ZAP securely, protect API keys and database credentials, and avoid exposing internal service ports to untrusted networks.
