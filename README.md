# Freq_test

Create a Freq0097 web site with SQL database to offer a gmail binding end-user to login and do some root freq test

## Quick Start

1. **Read CLAUDE.md first** - Contains essential rules for Claude Code
2. Follow the pre-task compliance checklist before starting any work
3. Use proper module structure under `src/main/typescript/`
4. Commit after every completed task

## Project Structure

This project follows a standard TypeScript application structure:

```
src/
├── main/
│   ├── typescript/          # TypeScript source code
│   │   ├── core/           # Core business logic
│   │   ├── utils/          # Utility functions
│   │   ├── models/         # Data models/entities
│   │   ├── services/       # Service layer
│   │   └── api/            # API endpoints/interfaces
│   └── resources/          # Configuration and assets
│       ├── config/         # Configuration files
│       └── assets/         # Static assets
└── test/                   # Test code
    ├── unit/               # Unit tests
    └── integration/        # Integration tests
```

## Features

- 🔐 Gmail OAuth authentication
- 🗄️ SQL database integration
- 🧪 Frequency testing capabilities
- 🚀 TypeScript for type safety
- ⚡ Modern web architecture

## Development Guidelines

- **Always search first** before creating new files
- **Extend existing** functionality rather than duplicating
- **Use Task agents** for operations >30 seconds
- **Single source of truth** for all functionality
- **Language-agnostic structure** - scalable TypeScript architecture
- **Commit frequently** - after each completed feature

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

- **Frontend**: Modern TypeScript web application
- **Backend**: Node.js/Express with TypeScript
- **Database**: SQL database for user data and frequency test results
- **Authentication**: Gmail OAuth integration
- **Testing**: Comprehensive unit and integration tests