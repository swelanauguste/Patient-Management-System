# Patient-Management-System
The Ministry of Health, Wellness and Elderly Affairs  is in the process of re-engineering its Health Information Management system. Following a technical audit and requirements gathering, it was agreed that the system architecture must be modernized and modules rewritten to be fit for purpose.

## Run the project (Docker)

This project runs two development services with Docker Compose:

- Django API (`web`) on port `8000`
- React + Vite UI (`ui`) on port `5173`

### Prerequisites

- Docker Desktop installed and running
- Docker Compose available (`docker compose` command)

### Start the project

From the repository root, run:

```bash
docker compose -f docker-compse.yml up --build
```

Then open:

- API: `http://localhost:8000`
- UI: `http://localhost:5173`

### Run in background

```bash
docker compose docker-compose.yml up --build -d
```

### Stop services

```bash
docker compos docker-compose.yml down
```

### Rebuild after dependency changes

If you change Python or Node dependencies and need a clean rebuild:

```bash
docker compose docker-compose.yml down
docker compose docker-compose.yml build --no-cache
docker compose docker-compose.yml up
```

### Helpful commands

Check running services:

```bash
docker compose docker-compose.yml ps
```

View logs:

```bash
docker compose docker-compose.yml logs -f
```

Open a shell in Django container:

```bash
docker compose docker-compose.yml exec web sh
```

Open a shell in UI container:

```bash
docker compose docker-compose.yml exec ui sh
```
