# Tymonial Backend API.

The backend api which powers [Tymonial](https://tymonial.vercel.app).
# Setup

- ## Clone the repo

```js
    git clone https://github.com/Benrobo/tymonail-api.git
```

- ## Install all dependencies
```js
    // if npm is default package manager
    npm install

    // if yarn is default package manager
    yarn add
```

- ## Create a .env file. Paste and update the created .env file to the variables found in `.env.development`

```js
    DATABASE_URL="postgresql://postgres:1234@localhost:5432/tymonial?schema=public&connect-timeout=300"

    JWT_SECRET="some-secret-here"

    MAX_API_REQUEST_COUNT = 500

    NODE_ENV="development"
```

## Tymonial kit uses `Prisma ORM` for managing `Postgresql Database`. So it compulsory you have postgresql installed, if not follow the link below on setting up postgresql and prisma orm on your pc

- ## [Postgresql Setup](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)

- ## [Prisma Setup](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres)


- ## Migrate `schema.prisma` using the below command.
    
```diff
    npm run prisma-migrate
```
### This would do two things :
- It creates a new SQL migration file for this migration

- It runs the SQL migration file against the database

## Congratulation, you can now start exploring and adding other features 🚀.


## Start local Server.

```bash
    # start api development server
    documents/projects/trakka/api~$ npm run dev
```

### Api EndPoints.
Here are some API endpoint which could be called `localy` on your computer.

- [x] Registeration:
    - `/api/auth/register`.
    - `method`: `POST`.
    - `Body`: `username`, `email`, `password`.
    - `Headers`:
        - `Authorization`:  `NONE`

- [x] Login:
    - `/api/auth/login`.
    - `method`: `POST`.
    - `Body`:  `email`, `password`.
    - `Headers`:
        - `Authorization`:  `NONE`

- [x] getUsers:
    - `/api/users`.
    - `method`: `GET`.
    - `Body`:  `NONE`
    - `Headers`:
        - `Authorization`:  `NONE`

- [x] getUser:
    - `/api/user`.
    - `method`: `GET`.
    - `Body`:  `userId`
    - `Headers`:
        - `Authorization`:  `AccessToken`

- [x] getTemplates:
    - `/api/templates/get`.
    - `method`: `POST`.
    - `Body`:  `userId`
    - `Headers`:
        - `Authorization`:  `AccessToken`

- [x] createTemplate:
    - `/api/templates/create`.
    - `method`: `POST`.
    - `Body`:  `userId`, `name`
    - `Headers`:
        - `Authorization`:  `AccessToken`

- [x] deleteTemplate:
    - `/api/templates/delete`.
    - `method`: `DELETE`.
    - `Body`:  `userId`, `name`
    - `Headers`:
        - `Authorization`:  `AccessToken`


> NOTE , If any issue were encountered when setting up the backend API, kindly create an [ISSUE HERE](https://github.com/Benrobo/tymonail-api/issues). your feedback is highly appreciated.























