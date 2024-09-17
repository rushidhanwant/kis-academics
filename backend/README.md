## KIS ACADEMICS


# Setup

### 1. Install Node v18 or Use NVM
To use Node version 18, run the following command:

```bash
nvm use 18
```

### 2. Install Dependencies
Install the necessary dependencies using npm:

```bash
yarn install
```

### 3. Update Environment Variables
Copy the example environment file and update your environment variables:

```bash
cp .env.example .env
```

### 4. Install Postgres
Ensure you have Postgres installed on your system.

### 6. Run Complete Backend Setup
Install pacakges, Setup database, run migration and seed database

```bash
yarn run setup
```

### 7. Start Development Server
Start the development server:

```bash
yarn run start:dev
```

# Documentation

Swagger docs are available at:

```
http://localhost:4000/documentation
```
