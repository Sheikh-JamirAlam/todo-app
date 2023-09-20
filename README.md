<h1 align="center">Todofy</h1>

A Todo app to manage all your todos made in React.

### Tech stack used:

- Vite (React - TypeScript)
- MongoDB
- Express
- Docker

## Local Development

To develop Todofy locally, you will need to clone this repository.

```
git clone https://github.com/Sheikh-JamirAlam/todo-app.git
cd todo-app
```

There are two ways to setup Todofy locally.

### 1. Docker Environment

You'll also need to have [Docker](https://docs.docker.com/get-docker/) setup in your local machine.

Set up all the env vars outlined in the [`.env.example` file](https://github.com/Sheikh-JamirAlam/todo-app/blob/main/.env.example).

```
SECRET_KEY= <Secret string for jwt authentication>
MONGODB_URL= <Your mongodb url here>
```

Next you'll need to run this command in your terminal.

```
docker-compose up -d
```

You'll have Todofy running on http://localhost:8000

### 2. NodeJS Environment

Set up all the env vars outlined in the [`.env.example` file](https://github.com/Sheikh-JamirAlam/todo-app/blob/main/server/.env.example) inside the server folder.

You'll need two terminals for this to work. Run these commands in one terminal.

```
cd client
npm install
npm run dev
```

In the other terminal run the following commands.

```
cd server
npm install
npm run build
npm run start
```

You'll have Todofy running on http://localhost:5000
