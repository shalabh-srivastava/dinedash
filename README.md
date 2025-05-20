
# DineDash RMS

DineDash is a Restaurant Management System designed to streamline orders, menu management, feedback collection, and sales analytics.

## Features

*   Order Management: Create, view, and manage customer orders (uses mock data).
*   Menu Management: Add, view, and categorize menu items (uses mock data).
*   Feedback Submission: Customers can submit feedback which is stored in a SQLite database.
*   Sales Analytics: (Manager role) View sales trends, peak hours, and popular items (uses mock data).
*   AI-Powered Suggestions: (Manager role) Get suggestions for order modifiers (currently uses mock data).
*   Role-Based Access: Simplified manager login (using hardcoded credentials "manager@email.com" / "password") for accessing all features. No customer-specific login.

## Tech Stack

*   Next.js (App Router)
*   React
*   TypeScript
*   Tailwind CSS
*   ShadCN UI Components
*   Lucide React Icons
*   Recharts for charts
*   SQLite (for feedback storage)
*   `sqlite3` and `bcryptjs` for database operations
*   Genkit (for AI features, currently mocked)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn)
*   Build tools for `sqlite3` (often installed automatically with Node.js, but if you encounter issues during `npm install` related to `sqlite3`, you might need to install `node-gyp` and relevant C++ build tools for your OS).

### Local Deployment

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd dinedash-rms 
    ```
    (Replace `<your-repository-url>` with the actual URL and `dinedash-rms` with your project's directory name if different)

2.  **Install dependencies:**
    This will install all necessary packages, including `sqlite3` and `bcryptjs`.
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

3.  **Environment Variables (Optional - if using live AI):**
    The application currently uses mocked AI features and does not require an API key. If you decide to integrate a live AI provider with Genkit later (e.g., Mistral AI), you'll need to set up an API key.
    Create a `.env` file in the root of your project and add your API key:
    ```env
    # Example for Mistral AI if re-enabled:
    # MISTRAL_API_KEY=your_mistral_api_key_here 
    ```

4.  **Run the Next.js development server:**
    This command starts the main application.
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    The application should now be running at [http://localhost:9002](http://localhost:9002) (or another port if 9002 is in use - check your terminal output).

5.  **Run the Genkit development server (if using non-mocked AI features):**
    This step is **not currently required** as AI suggestions are mocked. If you re-enable live AI features, you'll need to run the Genkit development server in a separate terminal.
    ```bash
    npm run genkit:dev
    ```
    or for auto-reloading on Genkit flow changes:
    ```bash
    npm run genkit:watch
    ```

### Accessing the Application

*   Open your browser and navigate to [http://localhost:9002](http://localhost:9002).
*   You will be prompted to log in. Use the following credentials for manager access:
    *   **Email**: `manager@email.com`
    *   **Password**: `password`
*   Upon successful login, you will be redirected to the orders dashboard.

### Database Information

*   The application uses **SQLite** for storing feedback.
*   A database file named `dinedash.sqlite` will be automatically created in the root directory of the project when the application first runs and attempts a database operation (e.g., submitting feedback).
*   The initial manager user ("manager@email.com") is also intended to be managed via the database, but the current login mechanism is client-side mocked. If server-side credential checking is re-enabled, this user would be checked against the database.

### Viewing SQLite Database Content (e.g., in VS Code)

You can inspect the `dinedash.sqlite` database using various SQLite browser tools. If you're using VS Code, here's a common way:

1.  **Install a SQLite Extension**:
    *   Open VS Code.
    *   Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).
    *   Search for "SQLite" and install a popular extension. Good options include:
        *   **SQLite** by *alexcvzz*
        *   **SQLite Viewer** by *Florian KUCHLER*
        *   **SQLite Explorer** by *CLC*

2.  **Open the Database**:
    *   Once the extension is installed, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
    *   Type "SQLite" and look for a command like "SQLite: Open Database" or "SQLite Explorer: Open Database".
    *   Select this command.
    *   When prompted, navigate to your project's root directory and select the `dinedash.sqlite` file.

3.  **Explore Tables**:
    *   The extension will typically open a new tab or a view in the sidebar showing the database schema.
    *   You can see tables like `users` (if user management via DB is active) and `feedback`.
    *   You can click on a table name to view its data, run custom SQL queries, etc.

## Project Structure Overview

*   `src/app/`: Main application routes using Next.js App Router.
    *   `(app)/`: Authenticated routes (orders, menu, analytics, feedback).
    *   `(auth)/`: Authentication related routes (login).
*   `src/components/`: Reusable UI components.
    *   `ui/`: ShadCN UI components.
    *   `charts/`: Recharts-based chart components.
*   `src/ai/`: Genkit related files.
    *   `flows/`: Genkit flows for AI logic (currently mocked).
*   `src/contexts/`: React contexts (e.g., `AuthContext`).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions, mock data, database connection (`db.ts`), and Zod schemas (`schemas.ts`).
*   `src/actions/`: Server Actions for handling form submissions (e.g., `auth.ts`, `feedback.ts`).
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets.
*   `dinedash.sqlite`: SQLite database file (created automatically in the project root).

---

To get started with development, take a look at `src/app/page.tsx` which redirects to the login or orders page. The main application layout for authenticated users is in `src/app/(app)/layout.tsx`.
