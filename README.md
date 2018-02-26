# react-router-dispatcher-chunk

[![npm](https://img.shields.io/npm/v/react-router-dispatcher-chunk.svg)](https://www.npmjs.com/package/react-router-dispatcher-chunk)
[![npm](https://img.shields.io/npm/dm/react-router-dispatcher-chunk.svg)](https://www.npmjs.com/package/react-router-dispatcher-chunk)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/react-router-dispatcher-chunk/master.svg)](https://circleci.com/gh/adam-26/react-router-dispatcher-chunk/tree/master)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6554428829061bb18228/test_coverage)](https://codeclimate.com/github/adam-26/react-router-dispatcher-chunk/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/6554428829061bb18228/maintainability)](https://codeclimate.com/github/adam-26/react-router-dispatcher-chunk/maintainability)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Pre-loads [react-chunk](https://github.com/adam-26/react-chunk) dynamic route imports for client rendering.

This makes it easy to:
 * configure code splitting for routes
 * use dynamically loaded route components with static methods

## Usage

This package is intended to be used with [react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config) and [react-router-dispatcher](https://github.com/adam-26/react-router-dispatcher).

```js
// aboutRouteChunk.js
import React from 'react';
import { chunk } from 'react-chunk';

// Dynamically imported route component
const AboutRouteChunk = chunk(() => import('./aboutRoute'))();

export default AboutRouteChunk
```

Define the application routes using [react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config).

```js
// routes.js
import Root from './rootRoute';
import AboutRouteChunk = from './aboutRouteChunk';
import {routeChunk} from 'react-router-dispatcher-chunk';

// react-router-config routes
const routes = [
  { component: Root,
    routes: [
      { path: '/',
        exact: true,
        component: Home
      },
      {
        // the client will pre-load the about chunk BEFORE rendering the route
        path: '/about',
        component: routeChunk()(AboutRouteChunk)
      }
    ]
  }
]

```

Configuring the dispatcher action using [react-router-dispatcher](https://github.com/adam-26/react-router-dispatcher).

**IMPORTANT:** if using `CHUNK`, it **must** be the _first_ configured route action.

```js
import { createRouteDispatchers } from 'react-router-dispatcher';
import { CHUNK } from 'react-router-dispatcher-chunk';
import routes from './routes';

const {
    UniversalRouteDispatcher,
    ClientRouteDispatcher,
    dispatchClientActions,
    dispatchServerActions
} = createRouteDispatchers(routes, [CHUNK]);

```

### Install

#### NPM

```js
npm install --save react-router-dispatcher-chunk
```

#### Yarn

```js
yarn add react-router-dispatcher-chunk
```

### API

`routeChunk(options)`

#### Options

`getChunkLoaderStaticMethodName?: string`: Optional

* Optional, the static method name used to retrieve the chunk loader from the route component(s)

### Contribute
For questions or issues, please [open an issue](https://github.com/adam-26/react-router-dispatcher-chunk/issues), and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run `npm test` to verify that your coe adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

### License
MIT