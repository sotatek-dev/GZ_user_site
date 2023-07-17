# Galatix Zone User Frontend

## Development

### Setup environment variables
```bash
cp .env.example .env
```
Update each env key with equivalent value. `.env.development` contains key-value env variables for development environment.

### Install dependencies

```bash
yarn
# or
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

## Deployment

### Production optimization build
Run command to build project

```bash
yarn build
```

### Deploy into Nodejs environment
#### PM2

Install `pm2`
```bash
yarn add global pm2
```

Run optimization build on `pm2` by running command
```bash
pm2 start yarn --name "galactixzone-fe" --interpreter bash -- start
pm2 show galactixzone-fe
```
Production app now is ready on port `3002`