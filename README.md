
# DineDash RMS

DineDash is a Restaurant Management System designed to streamline orders, menu management, and sales analytics.

## Features

*   Order Management: Create, view, and manage customer orders.
*   Menu Management: Add, view, and categorize menu items.
*   Sales Analytics: (Manager role) View sales trends, peak hours, and popular items.
*   AI-Powered Suggestions: (Manager role) Get suggestions for order modifiers (currently uses mock data).
*   Role-Based Access: Simplified manager login for accessing all features.

## Tech Stack

*   Next.js (App Router)
*   React
*   TypeScript
*   Tailwind CSS
*   ShadCN UI Components
*   Lucide React Icons
*   Recharts for charts
*   Genkit (for AI features, currently mocked)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn)

### Local Deployment

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd dinedash-rms 
    ```
    (Replace `<your-repository-url>` with the actual URL and `dinedash-rms` with your project's directory name if different)

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

3.  **Set up Environment Variables (Optional - if using live AI):**
    If you decide to use a live AI provider with Genkit (e.g., Mistral AI), you'll need to set up an API key.
    Create a `.env` file in the root of your project and add your API key:
    ```env
    MISTRAL_API_KEY=your_mistral_api_key_here 
    # Or any other API keys if you switch providers
    ```
    *Currently, the AI features are mocked and do not require an API key.*

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
    If you have configured a live AI provider and want to use actual AI-powered suggestions, you need to run the Genkit development server in a separate terminal.
    ```bash
    npm run genkit:dev
    ```
    or for auto-reloading on Genkit flow changes:
    ```bash
    npm run genkit:watch
    ```
    *Note: As of the current setup, the AI suggestions are mocked, so this step is not strictly necessary for basic app functionality but is good to know if you enable live AI.*

### Accessing the Application

*   Open your browser and navigate to [http://localhost:9002](http://localhost:9002).
*   You will be prompted to log in. Click "Login as Manager" to access the application.

## Project Structure Overview

*   `src/app/`: Main application routes using Next.js App Router.
    *   `(app)/`: Authenticated routes (orders, menu, analytics).
    *   `(auth)/`: Authentication related routes (login).
*   `src/components/`: Reusable UI components.
    *   `ui/`: ShadCN UI components.
    *   `charts/`: Recharts-based chart components.
*   `src/ai/`: Genkit related files.
    *   `flows/`: Genkit flows for AI logic.
*   `src/contexts/`: React contexts (e.g., `AuthContext`).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions and mock data.
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets.

---

To get started with development, take a look at `src/app/page.tsx` which redirects to the login or orders page. The main application layout for authenticated users is in `src/app/(app)/layout.tsx`.
