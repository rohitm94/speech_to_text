# ITCS 6114 - Speech to Text

## Installation
First, ensure you have [node.js](https://nodejs.org/en/) installed. Developed is done in v10.9, although there shouldn't be any issues if you run it on any other version.

Install the `yarn` package manager via `npm`. `npm` should be on your path if you correctly installed node.

```
npm install -g yarn
```

## Usage

This software consists of two servers, namely `dashboard` and `jarvis`. `jarvis` handles all API calls to Google Cloud, while `dashboard` is used to serve the dashboard to the client. This is done for flexibility in terms of development and deployment technologies.

### dashboard

Use these commands to start the dashboard server -
```
cd dashboard
```
First, install all the dependencies using -
```
npm install
```

And start the development server using -
```
yarn serve // serving a unoptimized dev server with hot reload
yarn build // generate a production build
```

For cross-platform builds using [Electron](https://electronjs.org/), do -
```
yarn electron:serve
yarn electron:build
```

### jarvis

Use these commands to start the jarvis server -
```
cd jarvis
```
First, install all the dependencies using -
```
yarn install
```
And start the server using -
```
node index.js // listens on localhost, port 3000
```

> `jarvis` won't be able to successfully make API calls until you supply it with an Google cloud authentication key of your own.

## License

[MIT license](https://github.com/redkenrok/node-audiorecorder/blob/master/LICENSE)