# Crawlee + PlaywrightCrawler + TypeScript Monorepo

This project is a **Monorepo** setup utilizing **Yarn Workspaces** and **Lerna** to manage multiple packages efficiently. It integrates `Crawlee`, `PlaywrightCrawler`, **TypeScript**, and **Prisma** to provide a scalable and maintainable structure for web crawling and data management.

## Table of Contents

- [Crawlee + PlaywrightCrawler + TypeScript Monorepo](#crawlee--playwrightcrawler--typescript-monorepo)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [Key Features](#key-features)
  - [Project Structure](#project-structure)
    - [Packages Overview](#packages-overview)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
    - [Root Scripts](#root-scripts)
  - [Running Submodules](#running-submodules)
    - [1. Running the Crawler (`gmgn_crawler`)](#1-running-the-crawler-gmgn_crawler)
    - [2. Managing Prisma (`prisma_pg`)](#2-managing-prisma-prisma_pg)
    - [3. Using Common Utilities (`common`)](#3-using-common-utilities-common)
  - [Path Aliases](#path-aliases)
    - [Configuration](#configuration)
  - [Configuration](#configuration-1)
    - [TypeScript](#typescript)
    - [Prisma](#prisma)
    - [ESLint \& Prettier](#eslint--prettier)
  - [Contributing](#contributing)
  - [License](#license)
  - [Additional Resources](#additional-resources)

## Introduction

This Monorepo template is designed to streamline the development process for projects that require multiple interconnected packages. By leveraging **Yarn Workspaces** and **Lerna**, it ensures efficient dependency management, consistent configurations, and streamlined workflows across all packages.

### Key Features

- **Monorepo Management**: Centralized handling of multiple packages.
- **TypeScript Support**: Strong typing and modern JavaScript features.
- **Prisma Integration**: Robust ORM for database interactions.
- **PlaywrightCrawler**: Advanced web crawling capabilities.
- **Path Aliases**: Simplified module imports using `@/` prefix.
- **ESLint & Prettier**: Consistent code style and linting.
- **Concurrently**: Run multiple scripts in parallel during development.

## Project Structure


### Packages Overview

- **prisma_pg**: Manages Prisma schema and client generation for PostgreSQL interactions.
- **gmgn_crawler**: The main crawler application utilizing PlaywrightCrawler.
- **common**: Shared utilities and functions used across multiple packages.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v16.x or higher)
- **Yarn** (v1.22.22)
- **TypeScript** (installed via project dependencies)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/dex_crawler.git
   cd dex_crawler
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

   This command will install all dependencies for the root project and all sub-packages, leveraging Yarn Workspaces for efficient dependency management.

3. **Bootstrap the Monorepo with Lerna**

   ```bash
   yarn bootstrap
   ```

   This command ensures all inter-package dependencies are correctly linked.

## Available Scripts

All scripts are defined in the root `package.json` and can be executed using Yarn.

### Root Scripts

- **`yarn build`**

  Compiles all TypeScript packages using project references.

  ```bash
  yarn build
  ```

- **`yarn start:dev`**

  Runs the development environment concurrently for all sub-packages.

  ```bash
  yarn start:dev
  ```

- **`yarn prisma:generate`**

  Generates the Prisma client.

  ```bash
  yarn prisma:generate
  ```

- **`yarn prisma:migrate`**

  Runs Prisma migrations.

  ```bash
  yarn prisma:migrate
  ```

- **`yarn bootstrap`**

  Bootstrap the Monorepo using Lerna to link dependencies.

  ```bash
  yarn bootstrap
  ```

- **`yarn test`**

  Placeholder for running tests. Currently, it exits with an error as no tests are defined.

  ```bash
  yarn test
  ```

## Running Submodules

Each submodule can be managed individually or as part of the entire Monorepo.

### 1. Running the Crawler (`gmgn_crawler`)

The main crawler application uses PlaywrightCrawler for web scraping tasks.

- **Start in Development Mode**

  ```bash
  yarn workspace @dex_crawler/gmgn_crawler run dev
  ```

  This command runs the `dev` script defined in `gmgn_crawler/package.json`, typically using `tsx` for hot-reloading during development.

- **Start in Production Mode**

  First, build the project:

  ```bash
  yarn workspace @dex_crawler/gmgn_crawler run build
  ```

  Then, run the compiled code:

  ```bash
  yarn workspace @dex_crawler/gmgn_crawler run start
  ```

### 2. Managing Prisma (`prisma_pg`)

Handles database schema and client generation using Prisma.

- **Generate Prisma Client**

  ```bash
  yarn prisma:generate
  ```

- **Run Migrations**

  ```bash
  yarn prisma:migrate
  ```

- **Build Prisma Package**

  ```bash
  yarn workspace @dex_crawler/prisma run build
  ```

### 3. Using Common Utilities (`common`)

Shared utilities can be used across multiple packages.

- **Build Common Package**

  ```bash
  yarn workspace @dex_crawler/common run build
  ```

  After building, other packages can import utilities as follows:

  ```typescript
  import { someUtility } from '@dex_crawler/common';
  ```

## Path Aliases

To simplify module imports, path aliases using the `@/` prefix are configured across all sub-packages.

### Configuration

Each sub-package’s `tsconfig.json` includes the following path alias setup:


## Configuration

### TypeScript

TypeScript is configured to use project references for efficient builds and better scalability.

- **Root `tsconfig.json`**

  ```json
  {
    "compilerOptions": {
      "composite": true,
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "target": "ES2022",
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {},
      "lib": ["ES2022"],
      "typeRoots": ["node_modules/@types"],
      "esModuleInterop": true,
      "skipLibCheck": true
    },
    "include": [],
    "references": [
      { "path": "packages/prisma_pg" },
      { "path": "packages/gmgn_crawler" },
      { "path": "packages/common" }
    ]
  }
  ```

- **Sub-package `tsconfig.json` Example (`gmgn_crawler`)**

  ```json:packages/gmgn_crawler/tsconfig.json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src",
      "composite": true,
      "baseUrl": "./",
      "paths": {
        "@/*": ["src/*"]
      }
    },
    "include": ["src/**/*"],
    "exclude": ["dist"],
    "references": [
      { "path": "../prisma_pg" },
      { "path": "../common" }
    ]
  }
  ```

### Prisma

Prisma is used as the ORM for database interactions.

- **Prisma Schema (`prisma_pg/prisma/schema.prisma`)**

  ```prisma:packages/prisma_pg/prisma/schema.prisma
  generator client {
    provider = "prisma-client-js"
    output   = "../node_modules/@prisma/client"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  // Define your models here
  ```

- **Generating Prisma Client**

  Ensure the `output` path is correctly set to the sub-package's `node_modules` to allow other packages to consume the client seamlessly.

  ```bash
  yarn prisma:generate
  ```

### ESLint & Prettier

Ensure code quality and consistency across the Monorepo.

- **ESLint Configuration (`.eslintrc.js`)**

  ```javascript:.eslintrc.js
  module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:prettier/recommended'
    ],
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      'prettier/prettier': 'error'
      // Add or override rules as needed
    }
  };
  ```

- **Prettier Configuration (`.prettierrc`)**

  ```json:.prettierrc
  {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all"
  }
  ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

   Describe your changes and submit the PR for review.

## License

This project is licensed under the [MIT License](LICENSE).

## Additional Resources

- [Yarn Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Lerna Documentation](https://lerna.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Crawlee Documentation](https://crawlee.dev/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)