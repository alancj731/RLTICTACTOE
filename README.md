# RL Tic Tac Toe

This is a Next.js tic-tac-toe app with a reinforcement-learning player. The pretrained policy files are loaded from `src/data` at runtime; the app does not use GCP for training data storage.

## Requirements

- Node.js 22 or newer
- npm
- Docker, for container builds

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:7788](http://localhost:7788).

## Production Build

Build the app locally:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The production server also listens on [http://localhost:7788](http://localhost:7788).

## Training Data

Policy data is stored in:

```text
src/data/policy_first.policy
src/data/policy_second.policy
```

The Docker image copies `src/data` into the runtime container so pretrained play works without external credentials or cloud storage.

## Docker

Build the image:

```bash
docker build -t rltictactoe .
```

Run the container:

```bash
docker run --rm -p 7788:7788 rltictactoe
```

Open [http://localhost:7788](http://localhost:7788).

## Useful Commands

```bash
npm run dev
npm run build
npm start
```
