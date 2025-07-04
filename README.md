# Prism - AI-Powered Topic Analysis Platform

![Prism Homepage](https://raw.githubusercontent.com/user-attachments/assets/19b51887-b363-494b-9494-f25b2909f298)

Prism is a sophisticated, AI-powered topic analysis platform designed to provide comprehensive, multi-perspective analysis of any given topic. It aggregates and analyzes content from across the digital world, presenting users with detailed insights, diverse viewpoints, and emerging trends in a stunning, modern interface.

## Features

- **AI-Powered Analysis**: Leverages the Gemini API to deliver nuanced, multi-faceted analysis of any topic.
- **Dynamic & Interactive UI**: A beautiful, translucent "glassmorphism" interface built with Next.js, React 19, and Framer Motion.
- **Rich Data Visualization**: Presents complex information through an intuitive four-tab layout: Overview, Perspectives, Contrasts, and Insights.
- **Stateful & Interactive Components**: Features expandable cards, sentiment indicators, and key point summaries for a rich user experience.
- **Discover Page**: Browse a curated list of trending and important topics.
- **Responsive Design**: Fully responsive layout ensures a seamless experience across all devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.2.4 (with App Router)
- **UI Library**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI**: [Google Gemini](https://ai.google.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- [pnpm](https://pnpm.io/installation) package manager

### Installation

1.  **Clone the repository**
    ```sh
    # If you have SSH set up
    git clone git@github.com:<YOUR_USERNAME>/prism-app.git

    # Or with HTTPS
    git clone https://github.com/<YOUR_USERNAME>/prism-app.git
    ```

2.  **Navigate to the project directory**
    ```sh
    cd prism-app
    ```

3.  **Install dependencies**
    ```sh
    pnpm install
    ```

4.  **Set up environment variables**

    Create a `.env.local` file in the root of the project and add the following, replacing the placeholder values with your actual API keys:

    ```env
    # .env.local

    # Get your API key from Google AI Studio
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # (Optional) Get your API key from https://newsapi.org/
    NEWS_API_KEY=YOUR_NEWS_API_KEY
    ```

### Available Scripts

In the project directory, you can run the following commands:

- **`pnpm dev`**: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- **`pnpm build`**: Builds the app for production to the `.next` folder.
- **`pnpm start`**: Starts a Next.js production server.
- **`pnpm lint`**: Runs the Next.js linter to identify and fix code quality issues. 