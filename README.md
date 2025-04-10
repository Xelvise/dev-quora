# DevQuora - Developer Q&A Platform

DevQuora is a comprehensive Q&A platform specifically designed for developers to ask questions, share knowledge, and collaborate with others in the tech community. It serves as a valuable resource for programmers seeking solutions to coding challenges, best practices, and technical advice.

## Project Overview

DevQuora aims to create a thriving community where developers can:

- Ask technical questions and receive high-quality answers
- Share knowledge and expertise with other developers
- Build reputation through constructive participation
- Save useful questions for future reference
- Upvote or downvote content based on quality

## Features

### User Features

- **Authentication:** Secure user authentication and profile management via Clerk.
- **Question Management:** Ask, edit, and delete questions with rich text formatting.
- **Answer System:** Post answers to questions with markdown support and code highlighting.
- **Voting System:** Upvote or downvote questions and answers.
- **Reputation System:** Earn reputation points for positive contributions.
- **Save Questions:** Bookmark questions for later reference.
- **User Profiles:** Personalized profiles showcasing stats and contributions.
- **AI-Powered Answers:** Generate answer suggestions using AI.

### Technical Features

- **Server-Side Rendering:** Fast page loads with Next.js SSR.
- **Responsive Design:** Mobile-friendly interface that works across devices.
- **Dark/Light Modes:** Toggle between color schemes.
- **Rich Text Editor:** Format questions and answers with TinyMCE.
- **Code Syntax Highlighting:** Display formatted code with Prism.js.
- **Real-time Updates:** Optimistic UI updates for voting actions.

## Tech Stack

### Frontend

- **Next.js**: React framework with server-side rendering.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Static type checking for JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **TinyMCE**: Rich text editor for content creation.
- **Prism.js**: Syntax highlighting for code blocks.

### Backend

- **Next.js API Routes**: Server-side API endpoints.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Clerk**: Authentication and user management.

### Tools & Libraries

- **React Hook Form**: Form validation and handling.
- **Zod**: TypeScript-first schema validation.
- **Shadcn UI**: Reusable UI components.
- **Google Gemini API**: AI for answer generation.

## Installation Guide

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB database
- Clerk account for authentication
- Google Gemini API key (for AI features)

### Setup Instructions

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd dev-quora
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Environment setup**
   Create a `.env.local` file in the root directory with the following variables:

    ```
    # MongoDB
    MONGODB_URI=your_mongodb_connection_string

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    # TinyMCE Editor
    NEXT_PUBLIC_TINY_APIKEY=your_tiny_mce_api_key

    # Google Gemini AI (optional)
    GOOGLE_GEMINI_API_KEY=your_gemini_api_key
    ```

4. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

## Deployment

The application can be deployed to platforms like Vercel or Netlify that support Next.js applications:

```bash
npm run build
# or
yarn build
```

## Project Structure

- `/app`: Next.js application routes and layouts
- `/Backend`: Database models and server actions
- `/Components`: Reusable UI components
- `/Constants`: Application constants and configuration
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Roadmap

- Job listings marketplace
- Direct messaging between users
- Community badges and achievements
- More advanced AI-powered features

## Author

Built with 💻 by [Elvis Gideon](https://linkedin.com/in/elvisgideon001)

## License

MIT
