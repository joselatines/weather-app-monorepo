# Weather App Frontend

This is the frontend for the Weather App, a React application built with Vite and TypeScript. It interacts with the [backend service](../backend/README.md) to display weather information, manage user authentication, and handle favorite cities.

## Features

*   **Weather Display**: Shows current weather conditions for searched cities.
*   **City Search**: Search for cities with autocomplete suggestions.
*   **User Authentication**: Secure user registration and login using JWT.
*   **Favorite Cities**: Logged-in users can save and manage their favorite cities.
*   **Recent Searches**: Keeps track of recently searched cities (stored locally).
*   **Responsive Design**: Adapts to different screen sizes.

## Tech Stack

*   **Framework**: [React](https://reactjs.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Styling**: [Bootstrap](https://getbootstrap.com/) & Custom CSS
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## Installation & Setup

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js)
*   The backend service should be running.

**Steps:**

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Backend API URL:**
    *   Create a `.env` file in the `frontend` directory (you can copy `.env.sample` from the backend if needed, but only the `VITE_API_BASE_URL` is relevant here).
    *   Set the `VITE_API_BASE_URL` variable to the URL where your backend API is running (e.g., `http://localhost:5000/api/v1`).
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (Vite's default port).

## Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Compiles TypeScript and bundles the application for production into the `dist` folder.
*   `npm run lint`: Runs ESLint to check for code style issues.
*   `npm run preview`: Starts a local server to preview the production build from the `dist` folder.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output files will be located in the `frontend/dist` directory.

## Docker

This frontend application can be containerized using Docker.

*   **Running with Docker Compose:** The easiest way to run both frontend and backend together is using the `docker-compose.yml` file located in the **root directory** of the monorepo:
    ```bash
    # From the root directory
    docker-compose up --build
    ```
*   **Frontend Dockerfile:** The `frontend/Dockerfile` uses a multi-stage build:
    1.  **Builder Stage**: Installs dependencies and builds the React application (`npm run build`).
    2.  **Runner Stage**: Uses Vite's preview server (`npm run preview`) to serve the built application. *Note: For a production deployment, you might switch the second stage to use Nginx (commented out in the Dockerfile) to serve the static files from the `dist` directory.*

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable React components
│   ├── lib/            # Utility functions, config
│   │   ├── config/     # API base URL config
│   │   └── utils/      # Helper functions
│   ├── pages/          # Page-level components (routed)
│   │   ├── cities/
│   │   ├── HomePage/
│   │   ├── LoginPage/
│   │   └── RegisterPage/
│   ├── types/          # TypeScript type definitions
│   ├── App.css         # Global App styles
│   ├── App.tsx         # Main App component with routing
│   ├── index.css       # Global CSS resets/base styles
│   └── main.tsx        # Application entry point
├── .env                # Environment variables (API URL) - MUST BE CREATED
├── .gitignore          # Files ignored by Git
├── Dockerfile          # Docker configuration
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML template
├── nginx.conf          # Example Nginx config (for production serving)
├── package.json        # Project dependencies and scripts
├── README.md           # This file
├── tsconfig.app.json   # TypeScript config for the app
├── tsconfig.json       # Base TypeScript config
├── tsconfig.node.json  # TypeScript config for Node.js env (e.g., Vite config)
└── vite.config.ts      # Vite configuration
