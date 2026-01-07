# Docker Guide for Perfume Ecommerce

## 1. Prerequisites
Since you are on Windows, you must install **Docker Desktop**:
1.  Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
2.  Install and **start** Docker Desktop.
3.  Ensure it is running (you should see the whale icon in your system tray).

## 2. Quick Start
To start the entire application (Frontend + Backend + Database):

1.  Open your terminal in the project root (`d:\Perfume-Ecommerce`).
2.  Run the following command:
    ```powershell
    docker-compose up --build
    ```
    *   `--build`: Forces Docker to rebuild the images (useful if you changed code).
    *   `up`: Starts the containers.

## 3. What is happening?
- **Backend**: Docker builds the code in `backend/` and starts it on port `5000`.
- **Frontend**: Docker builds the Next.js app in `frontend/` and starts it on port `3000`.
- **Database**: Starts a MongoDB instance on port `27017` (if enabled in `docker-compose.yml`).

## 4. Accessing the App
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## 5. Common Commands

| Action | Command |
| :--- | :--- |
| **Start & Build** | `docker-compose up --build` |
| **Start (Background)** | `docker-compose up -d` |
| **Stop & Remove** | `docker-compose down` |
| **View Logs** | `docker-compose logs -f` |

## 6. Concepts
- **Dockerfile**: A script that contains instructions to build a Docker image for a specific service (like your frontend or backend).
- **Image**: An immutable file that contains your application code, libraries, dependencies, and other files needed to run your application.
- **Container**: A running instance of an image.
- **Docker Compose**: A tool for defining and running multi-container Docker applications. It uses the `docker-compose.yml` file to configure your application's services.
