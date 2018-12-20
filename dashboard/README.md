# dashboard

This software consists of two servers, namely dashboard and jarvis. jarvis handles all API calls to Google Cloud, while dashboard is used to serve the dashboard to the client. This is done for flexibility in terms of development and deployment technologies.

## Project setup

First, ensure you have [node.js](https://nodejs.org/en/) installed. Development is done in v10.9, although there shouldn't be any issues if you run it on any other version.

Install the `yarn` package manager via `npm`. `npm` should be on your path if you correctly installed node.

```
npm install -g yarn
```

Then, install all the dependencies using -

```
npm install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

## Compiles for Electron builds
```
yarn electron:serve // dev
yarn electron:build // prodcution
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
