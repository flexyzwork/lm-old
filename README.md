# LM - EC2

This is a monorepo project created with turbo-ts-cli.
IaC & Blue-Green deploy for EC2.


## Before Start

0. Make .env files
   ```
   cp .env.example .env 
   ```

## Getting Started - Locally

To boot up the project for the first time:


0. Install and build
   ```
   pnpm install 
   pnpm build
   ```


1. Start the development environment:
   ```
   pnpm dev
   ```
   This command will start Docker containers and all the apps.

2. Once Docker is up, create the initial migration and migrate the database:
   ```
   pnpm db:init
   ```

3. Open the web(client) app(next.js): http://localhost:3000

4. Open the api(server) app(express.js): http://localhost:8001

   You can test using `apps/sever/api-test-*.http` file.

    🚀 How to Use

    1️⃣ Open api-test.http in VS Code

    2️⃣ Install REST Client (if not installed)

    3️⃣ Click “Send Request” next to any request
   
    4️⃣ 🎉 Test API instantly!


## Getting Started - CI/CD
0. Create git-action Secrets
   ```
   cp .env.cicd.example .env.cicd
   ```
1. Run pulumi
   ```
   pnpm infra:up
   ```
2. Push to deploy branch
   ```
   git add .
   git commit "comments"
   git push
   ```
3. Check your domain \
   https://your.domain



## Useful Commands

- `pnpm dev`: Start the development environment
- `pnpm build`: Build all packages and apps
- `pnpm check-types`: Run type checking for all packages and apps
- `pnpm db:reset`: Reset the database and run migrations

## Project Structure

- `apps/`: Contains all the applications
  - `client/`: Next.js web application
  - `server/`: Node.js worker application
- `packages/`: Contains shared packages
  - `docker/`: Docker configuration for local development
- `infra/`
  - `pulumi-aws`


