# Security Analysis Platform

A web application for analyzing software projects through **static and dynamic security testing**. The platform integrates Semgrep and OWASP ZAP into a single interface, allowing users to launch security scans, manage projects, and review their results.

The project was built as a practical exercise in full-stack development, application security, containerization, and service integration.

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

Instead of executing different security tools manually, users can select a project and launch one of two analysis modes:

- **Static Analysis:** examines source code for potential security vulnerabilities and coding issues without executing the application.
- **Dynamic Analysis:** runs security tests against a running web application to identify potential vulnerabilities from the outside.

The application integrates these tools into a web interface where users can access their projects and inspect the corresponding analysis results.

This project focuses not only on integrating security tools, but also on building the infrastructure required to connect a frontend, backend, database, and external scanning services.

## Features

- **Project Management:** organize projects submitted for security analysis.
- **Static Security Analysis:** execute Semgrep against project source code.
- **Dynamic Security Analysis:** integrate OWASP ZAP to scan running web applications.
- **Results Visualization:** access scan results through the application's interface by selecting a project's card.
- **REST API:** expose backend endpoints for communication between the frontend and backend services.
- **Persistent Storage:** use PostgreSQL to store application data.
- **Containerized Environment:** run the application and its supporting services with Docker Compose.
- **React Frontend:** provide a responsive interface built with React, TypeScript, and Tailwind CSS.

## Security Analysis

### Static Analysis — Semgrep

Static analysis examines source code without executing the target application.

The platform uses **Semgrep** to detect potential security issues according to the rules and configurations used by the scanner.

This approach is useful for identifying problems such as insecure coding patterns, potentially unsafe function usage, and other issues covered by the selected rulesets.

### Dynamic Analysis — OWASP ZAP

Dynamic analysis examines a running web application by sending requests and analyzing its responses.

The platform integrates **OWASP ZAP (Zed Attack Proxy)** to perform web application security testing. Depending on the scan configuration, this can include crawling the target and actively testing for potential vulnerabilities.

Dynamic analysis requires a reachable target application. It complements static analysis by examining behavior that cannot always be understood from source code alone.

### Viewing Results

Each project is represented by a project card in the frontend.

To inspect a project's analysis results, **click the project card's label**. The results are associated with the selected project and can be reviewed through the application's interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend development |
| Flask | HTTP routes and REST API |
| React | Frontend interface |
| TypeScript | Type-safe frontend development |
| Tailwind CSS | UI styling |
| Vite | Frontend development and production build |
| Semgrep | Static application security testing (SAST) |
| OWASP ZAP | Dynamic application security testing (DAST) |
| PostgreSQL | Relational database |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Gunicorn | Production WSGI server |

## Architecture

The application is organized into a frontend, a backend, and supporting services.

```text
                 USER
                   |
                   v
             React Frontend
          (React + TypeScript)
                   |
                   v
             Flask Backend
                   |
          +--------+--------+
          |        |        |
          v        v        v
       Semgrep  OWASP ZAP  PostgreSQL
        (SAST)    (DAST)    (Database)
```

### Component Responsibilities

- **React Frontend:** provides the user interface for selecting projects, launching analyses, and viewing results.
- **Flask Backend:** handles HTTP requests, coordinates analysis workflows, and communicates with the supporting services.
- **Semgrep:** performs static source-code analysis.
- **OWASP ZAP:** performs dynamic security testing against reachable web applications.
- **PostgreSQL:** provides persistent relational storage for the application's data.
- **Docker Compose:** defines and coordinates the containers and their network communication.

The frontend is built for production with Vite and served through the Flask application in the deployed container. Gunicorn is used to run the Python application.

## What I Practiced

This project was an opportunity to practice several concepts commonly used in modern software development.

### Full-Stack Development

- Building a frontend with React, TypeScript, and Tailwind CSS.
- Developing backend endpoints with Flask.
- Connecting frontend components to a backend API.
- Separating responsibilities between UI components, API routes, and service logic.

### API Design and Service Integration

- Designing REST endpoints and handling HTTP requests and responses.
- Integrating external security tools into backend workflows.
- Managing long-running operations, execution status, timeouts, and errors.
- Coordinating communication between independent components.

### Application Security

- Understanding the difference between static and dynamic application security testing.
- Integrating Semgrep and OWASP ZAP into an application workflow.
- Working with scanner configuration and API authentication.
- Understanding why security testing requires different approaches depending on whether source code or a running application is being analyzed.

### Databases

- Integrating PostgreSQL with a Python backend.
- Managing database connection configuration through environment variables.
- Separating persistent database data from the application container's lifecycle.

### Docker and Deployment

- Writing a multi-stage Dockerfile.
- Building the React frontend as part of the container image.
- Packaging the backend and frontend into a deployable image.
- Running multiple services with Docker Compose.
- Using service names for communication between containers.
- Configuring ports, environment variables, volumes, and service dependencies.
- Publishing a Docker image to Docker Hub so the application can be deployed without building the image locally.

### Configuration and Maintainability

- Separating configuration from application code.
- Using `.env` files for local configuration.
- Providing a `.env.example` template without publishing real credentials.
- Organizing code into modules and separating frontend and backend responsibilities.

## Installation and Setup

### Prerequisites

Before running the application, install:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine with the Docker Compose plugin.
- Git, if you want to clone the repository.

You do **not** need to install Python, Node.js, PostgreSQL, or OWASP ZAP directly on your machine when using the provided Docker Compose setup.

### 1. Clone the Repository

```bash
git clone https://github.com/MauroMesa2020/security-app
cd python-security
```

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

Open `.env` and configure the required values.

For example:

```dotenv
# OWASP ZAP
ZAP_API_KEY=replace_with_your_own_random_api_key
ZAP_API_URL=http://zap:8080
ZAP_TIMEOUT=1800
ZAP_POLL_INTERVAL=2
ZAP_ACTIVE_SCAN=true

# PostgreSQL
POSTGRES_DB=security_analysis
POSTGRES_USER=admin
POSTGRES_PASSWORD=replace_with_a_strong_password
```

The exact variables must match those expected by the application's configuration and `docker-compose.yml`.

**Important:** Inside Docker Compose, use `zap` and `db` as hostnames when communicating with those services. These are the Compose service names. `localhost` inside the application container refers to that container itself, not to PostgreSQL or OWASP ZAP.

If the Compose configuration constructs `DATABASE_URL` from the PostgreSQL variables, you do not need to define it separately. Otherwise, configure the connection string according to the backend's requirements, using `db` as the database hostname.

Never commit your real `.env` file or publish actual credentials.

### 3. Download the Docker Images

The application image is published on Docker Hub:

[`mauromesa2020/security-analysis-app`](https://hub.docker.com/r/mauromesa2020/security-analysis-app)

Pull the images defined in the Compose configuration:

```bash
docker compose pull
```

This downloads the published application image and the images for the supporting services.

### 4. Start the Application

Run:

```bash
docker compose up -d
```

Docker Compose will create and start the configured containers, networks, and persistent volumes.

Check the status:

```bash
docker compose ps
```

### 5. Access the Web Interface

Once the containers are running, open:

[http://localhost:5000](http://localhost:5000)

If the application does not start correctly, inspect its logs:

```bash
docker compose logs -f app
```

You can also inspect the supporting services:

```bash
docker compose logs -f db
docker compose logs -f zap
```

Press `Ctrl+C` to stop following the logs. This does not stop the containers.

## Configuration

The application uses environment variables to keep configuration separate from the source code.

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
| `DATABASE_URL` | Optional full database connection string, if required by the backend configuration. |

The application container should use `http://zap:8080` to access OWASP ZAP when both services are connected to the same Compose network.

If you run Flask directly on your host instead of inside Docker, the ZAP URL may need to be `http://127.0.0.1:8080`, assuming that port is published locally.

## Useful Docker Commands

| Command | Description |
|---|---|
| `docker compose up -d` | Start the services in the background. |
| `docker compose down` | Stop and remove the containers and Compose network. |
| `docker compose ps` | Show the status of the services. |
| `docker compose pull` | Download the latest images referenced by Compose. |
| `docker compose logs -f app` | Follow the application's logs. |
| `docker compose restart app` | Restart the application container. |

### Updating the Application

If the Compose file references the `latest` tag, download the updated image and recreate the application container:

```bash
docker compose pull app
docker compose up -d --force-recreate app
```

The `latest` tag is a mutable tag, not a guarantee that the image will automatically update. You must pull the new image to receive changes.

For reproducible deployments, versioned image tags are preferable.

### Persistent Data

PostgreSQL data is stored in a Docker named volume so that it can survive container recreation.

Uploaded project files can be stored in a host-mounted `web-sites/` directory if the Compose configuration includes the corresponding volume.

The following command stops the services and removes their containers and network, but normally preserves named volumes:

```bash
docker compose down
```

**Warning:** The following command also deletes Compose-managed named volumes, including the database volume, and can permanently remove stored data:

```bash
docker compose down -v
```

Use it only when you intentionally want to delete that persistent data.

## Project Structure

The repository is organized as follows:

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
├── src/
│   └── ...
├── database/
│   └── init/
└── ui-react/
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
- `src/`: backend modules and analysis logic.
- `Dockerfile`: instructions for building the application image.
- `docker-compose.yml`: configuration for the application and its supporting services.
- `requirements.txt`: Python dependencies.
- `database/init/`: optional database initialization scripts.
- `ui-react/`: React frontend source code and Vite configuration.
- `.env.example`: template for local environment configuration.

The exact contents of `src/` and `ui-react/src/` depend on the current implementation.

## Future Improvements

Potential directions for extending the project include:

- Adding user authentication and role-based access control.
- Improving scan history, filtering, and comparison between runs.
- Adding more detailed vulnerability reports and export options.
- Introducing asynchronous job processing for long-running scans.
- Adding automated tests and CI/CD workflows.
- Improving logging, monitoring, and error handling.
- Supporting additional static and dynamic security testing tools.

These are possible future enhancements, not necessarily features already implemented.

## Disclaimer

This project is intended for educational purposes and authorized security testing.

Only scan applications, repositories, and systems that you own or have explicit permission to test. Active scans can send potentially intrusive requests and may affect the availability or behavior of the target application.

Configure OWASP ZAP securely, protect API keys and database credentials, and avoid exposing internal service ports to untrusted networks.