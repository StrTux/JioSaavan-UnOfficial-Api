# Contributing to JioSaavan UnOfficial API

We love your input! We want to make contributing to JioSaavan UnOfficial API as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/JioSaavan-UnOfficial-Api
cd JioSaavan-UnOfficial-Api
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
# or
bun run dev
```

## Project Structure

```
├── src/              # Source code
├── _api/             # API routes
├── test/             # Test files
├── public/           # Public assets
└── .husky/           # Git hooks
```

## Adding New Features

1. Create a new branch
2. Add your feature
3. Add tests
4. Update documentation
5. Submit a pull request

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by opening a new issue.

## Feature Requests

We use GitHub issues to track feature requests. Open an issue to suggest new features.

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation with details of any API changes
3. The PR will be merged once you have the sign-off of other developers

## Code Style

- Use TypeScript
- Follow ESLint rules
- Write meaningful commit messages
- Add proper documentation
- Write tests for new features

## Testing

Run tests using:
```bash
npm test
# or
bun test
```

## Docker Support

The project includes Docker support. To run using Docker:

```bash
# Build and run using docker-compose
docker-compose up --build

# Or using Docker directly
docker build -t jiosaavan-api .
docker run -p 3500:3500 jiosaavan-api
```

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 