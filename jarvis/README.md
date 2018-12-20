# jarvis

This software consists of two servers, namely `dashboard` and `jarvis`. `jarvis` handles all API calls to Google Cloud, while `dashboard` is used to serve the dashboard to the client. This is done for flexibility in terms of development and deployment technologies.

> `jarvis` won't be able to successfully make API calls until you supply it with an Google cloud authentication key of your own.


## Project Setup

First, ensure you have [node.js](https://nodejs.org/en/) installed. Development is done in v10.9, although there shouldn't be any issues if you run it on any other version.

Install the `yarn` package manager via `npm`. `npm` should be on your path if you correctly installed node.

```
npm install -g yarn
```

Then, install all the dependencies using -
```
yarn install
```
And start the server using -
```
node index.js // listens on localhost, port 3000
```