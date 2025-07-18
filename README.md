# Coder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Coder is an AI-powered code generation tool designed to help developers ship code faster. It leverages artificial intelligence to generate pull requests based on project issues, streamlining the development process and boosting productivity.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Setup](#setup)
  - [Simple Mode Setup](#simple-mode-setup)
  - [Advanced Mode Setup](#advanced-mode-setup)
  - [Database Setup with Neon & Drizzle](#database-setup-with-neon--drizzle)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Features

- **AI-Generated Pull Requests**: Automatically create PRs based on issue descriptions and context.
- **GitHub Integration**: Seamless connection with your GitHub repositories to manage issues more effectively.
- **Template Management**: Create and utilize templates for consistent code generation and task automation.
- **Instruction System**: Define custom instructions to guide AI-generated code outputs tailored to specific needs.
- **Machine Learning Model Adaptation**: Utilize machine learning models to modify existing code to improve performance and readability.
- **Multi-Project Support**: Manage multiple projects within a singular advanced workspace.
- **Simple and Advanced Modes**: Choose between straightforward setups or a feature-rich development environment, enabling customization according to user skill levels.
- **Real-time Code Improvement**: Use AI to analyze and suggest optimizations for existing code directly from repositories.

## Demo

<img width="1615" height="1236" alt="image" src="https://github.com/user-attachments/assets/235b8d90-144e-4759-a397-48d0c068881e" />
<img width="1615" height="1236" alt="image" src="https://github.com/user-attachments/assets/46271473-4040-40eb-b8be-49a69f26aa59" />

Check out the latest demo of Coder in action:
[Coder Demo](https://youtu.be/buJ6BlQXtko)

## Setup

Coder offers two setup modes: Simple and Advanced. Choose the one that best fits your needs.

### Simple Mode Setup

Follow these instructions to set up a simple environment that supports AI features.

1. **Clone the Repository**

   ```bash
   git clone https://github.com/bastosmichael/coder.git
   cd coder
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Copy the `.env.example` to `.env.development.local` and fill in the respective values. Pull any existing values from Vercel so your local environment matches production:

   ```bash
   cp .env.example .env.development.local
   vercel env pull .env.development.local
   ```

   Required variables:
   
   - `NEXT_PUBLIC_APP_MODE=simple`
   - `ANTHROPIC_API_KEY=`
   - `OPENAI_API_KEY=`
   - `DATABASE_URL=`
   - `GITHUB_PAT=`

4. **Run the Application**
   ```bash
   npm run dev
   ```

### Advanced Mode Setup

For a full-fledged development environment, follow the setup instructions for Advanced Mode.

- Additional setup steps specific to enabling more complex AI features will be provided in future updates.

### Database Setup with Neon & Drizzle

1. Create a Postgres database in [Neon](https://neon.tech) or open the Neon console from your Vercel project.
2. Make sure the connection string is stored in your Vercel `DATABASE_URL` environment variable.
3. Pull the latest environment variables locally and run the migrations with Drizzle:

   ```bash
   vercel env pull .env.development.local
   npm run db:migrate
   ```

This ensures your local database schema matches the one deployed on Vercel.

## Usage

To maximize productivity with Coder, follow these steps to utilize its AI features effectively:

1. **Create a Workspace**: Start by creating a new workspace to organize your projects effectively.
2. **Add a Project**: Within your workspace, create a new project and connect it to a GitHub repository.
3. **Generate AI Suggestions**: After creating an issue in the project, utilize AI to generate code suggestions and improvements. This can be done easily through the application interface.
4. **Create an Issue**: Describe the feature or bug fix you want to implement, and let the AI generate a corresponding pull request.
5. **Review and Merge PR**: Use the AI suggestions, make necessary adjustments, and merge the pull request into your main branch.

## Deployment

To deploy Coder to Vercel and utilize its AI capabilities:

1. Fork the Coder repository to your GitHub account.
2. Sign up for a [Vercel account](https://vercel.com/signup) if you haven't already.
3. Click the button below to start the deployment process:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbastosmichael%2Fcoder&env=NEXT_PUBLIC_APP_MODE,ANTHROPIC_API_KEY,OPENAI_API_KEY,DATABASE_URL,GITHUB_PAT)

4. Follow the prompts to configure your deployment, ensuring all required environment variables are set. 
5. After deployment, set up your database and run migrations:

   ```bash
   npx vercel env pull .env.development.local
   npm run db:migrate
   ```

For more detailed deployment instructions, including advanced configurations, please refer to our [deployment guide](https://docs.coder.ai/deployment).

## Contributing

We welcome contributions to Coder! Here's how you can help:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a clear, descriptive message.
4. Push your changes to your fork.
5. Submit a pull request to the main Coder repository.

Please read our [Contribution Guidelines](CONTRIBUTING.md) for more details on our code of conduct, branch naming conventions, and pull request process.

## FAQ

**Q: How does Coder generate code?**
A: Coder uses advanced AI models to analyze your project structure, issue descriptions, and custom instructions to generate contextually appropriate code.

**Q: Is my code safe and private?**
A: Yes, Coder takes security seriously. We do not store your code, and all processing is done securely. However, please review our privacy policy for more details.

**Q: Can I use Coder with private repositories?**
A: Yes, Coder supports both public and private GitHub repositories.

For more frequently asked questions, visit our [FAQ page](https://docs.coder.ai/faq).

## License

Coder is open-source software licensed under the [MIT license](LICENSE).

## Acknowledgements

Coder is built using various open-source libraries and tools. A special thanks to all contributors and maintainers, including:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Buildware](https://github.com/mckaywrigley/buildware-ai)
- All contributors who helped enhance the AI capabilities in this project.
