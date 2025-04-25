# Full-Stack Weather Application (Monorepo)

This project is a full-stack weather application featuring a React frontend and a Node.js backend, managed within a single monorepo.

## Monorepo Structure

This repository uses a monorepo structure to manage the frontend and backend codebases together.

*   **`backend/`**: Contains the Node.js/Express API service responsible for user authentication, interacting with external weather APIs, and managing user favorites via a database.
    *   See [backend/README.md](./backend/README.md) for detailed backend documentation, setup, and API endpoints.
*   **`frontend/`**: Contains the React/Vite user interface that consumes the backend API to display weather information and allow user interactions.
    *   See [frontend/README.md](./frontend/README.md) for detailed frontend documentation and setup instructions.

## Core Technologies

*   **Backend**: Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL (or SQLite for dev), JWT
*   **Frontend**: React, Vite, TypeScript, React Router, Bootstrap
*   **Development**: Docker, Docker Compose, ESLint

## Getting Started (Docker - Recommended)

Running the application using Docker Compose is the recommended method as it handles both the backend and frontend services, along with database setup (if configured for Docker).

**Prerequisites:**

*   [Docker](https://docs.docker.com/get-docker/) installed
*   [Docker Compose](https://docs.docker.com/compose/install/) installed

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd weather-app-monorepo
    ```
2.  **Configure Environment Variables:**
    *   **Backend:** Create a `.env` file inside the `backend/` directory. You can copy `backend/.env.example` as a template. Ensure `DATABASE_URL` and `JWT_SECRET` are set correctly. For Docker Compose, the `DATABASE_URL` typically points to the database service name (e.g., `postgresql://user:password@db:5432/mydatabase?schema=public`).
    *   **Frontend:** Create a `.env` file inside the `frontend/` directory. Set `VITE_API_BASE_URL` to point to the backend service as exposed by Docker Compose (e.g., `http://localhost:5000/api/v1` if the backend is mapped to port 5000).
3.  **Run Docker Compose:**
    From the **root directory** of the project:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Forces Docker to rebuild the images if the Dockerfiles have changed.
    *   `-d`: Runs the containers in detached mode (in the background).

4.  **Access the Application:**
    *   **Frontend:** Typically available at `http://localhost:5173` (or the port mapped in `docker-compose.yml`).
    *   **Backend API:** Typically available at `http://localhost:5000` (or the port mapped in `docker-compose.yml`).

## Getting Started (Manual Setup)

You can also run the backend and frontend services independently without Docker.

1.  **Setup Backend:** Follow the instructions in [backend/README.md](./backend/README.md).
2.  **Setup Frontend:** Follow the instructions in [frontend/README.md](./frontend/README.md).

**Important:** Ensure the `DATABASE_URL` in `backend/.env` points to your manually configured database and `VITE_API_BASE_URL` in `frontend/.env` points to the correct address and port where the backend is running locally (e.g., `http://localhost:5000/api/v1`).

## Root Directory Contents

*   `docker-compose.yml`: Defines the services (backend, frontend, database) for Docker Compose orchestration.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `backend/`: Directory containing the backend API service.
*   `frontend/`: Directory containing the frontend React application.
*   `README.md`: This file, providing an overview of the monorepo.
