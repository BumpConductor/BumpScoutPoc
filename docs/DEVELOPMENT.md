# Development

See or update the [FAQ](./FAQ.md) for common questions.

The project is split into 2 parts.

- `app` - this is the pure javascript [Redux](http://redux.js.org/) application
- `ui` - this is the [Polymer](https://www.polymer-project.org/1.0/) UI view

Each part has its own set of tests.

The project is laid out as follows

```
.
├── app - the JS Redux app
|   ├── src - source files
|   └── test - tests
├── config - the firebase configurations for different environments
├── rules - the firebase database and storage rules
├── ui
|   ├── images - images used in the Polymer app
|   ├── src - the Polymer element source files
|   └── test - the Polymer element test files
├── index.html - the Polymer app entry point
└── etc...
```

Before making a change to the `src` for either part you should add the relevent tests. During development you can either run `npm test` to run the tests periodically on demand or run `npm start` in a separate terminal to continually run tests every time a file changes.

The `test` directories themselves mirror the structure of the `src` directories, for each source file there is likley to be a corresponding test file. You should follow the existing style when making changes.

**NB. The Redux app is compiled from ES6 to ES5 using Babel, so ES6 style should be applied throughout (`import`, `const`, `let`, etc). However it's not as easy to integrate Babel with the Polymer build tools so for now the Polymer UI app is pure ES5 (`var`, etc). This may change in the future if we replace the Polymer CLI with a more advanced build chain.**

Wherever possible the Polymer components should be kept dumb and only reference selectors, actions, etc from the Redux app.

## The Redux `app`

For the most part the Redux app follows a domains pattern with the following structure

```
.
├── [domain] - eg. auth for firebase authentication
|   ├── actions.js - exports the action creators, etc for the domain
|   ├── reducer.js - exports the reducer for the domain
|   └── selectors.js - exports the selectors for the domain
├── utils - helper libraries
├── actions.js - collects and exports the actions form all the domains
├── index.js - collects and exports the actions, selectors, store and start method. This is the entry point for the Polymer UI and is exposed there through the global app object
├── reducer.js - the top level reducer composed of the domain reducers
├── selectors.js - collects and exports the selectors from all the domains
├── service.js - listens for external events (not from the UI) to dispatch actions that originate from Firebase, for example. Exposes start and stop methods to manage listeners
└── store.js - imports the reducer, onstructs and exports the store
```

If you add a new domain remember to update the top level `actions.js`, `reducer.js`, `selectors.js` to collect and export the new functionality.

### Reducers

Remember that reducers should be pure functions. This means

- they should take a state and return a new state **without** mutating the existing state (they can and should reuse parts of the state that have not changed)
- they should **not** have side effects (update a database, etc)
- they should always evaluate to the same value for the same input (ie. they should not use impure functions like Date() that return different values depending on the external environment - such values should be passed in through actions)

This makes them easy to test

### Selectors

Selectors should also be pure functions. This means

- they should take a state and calculate the value that is required **without** changing the state
- they should **not** have side effects
- they should always evaluate to the same value for the same input (ie. they should not use impure functions like Date() that return different values depending on the external environment - such values should be passed in through actions that will add the input to the state)

Again this makes them easy to test.

Additionally, to optimise selectors so that values are only recalculated when they need to be, the [reselect](https://github.com/reactjs/reselect) library should be used.

**NB. it is better to implement a selector than to compute values in the Polymer UI code. They can be reused and more easily tested as selectors**

### Actions

Actions are the heart of a Redux application, this is how the environment talks to us and where we query the evironment. As such many actions will be asynchronous. We use [redux-thunk](https://github.com/gaearon/redux-thunk) to implement asynchronous chains of actions.

### Services

Currently there is only one service and it is listening for firebase events. As things grow we may introduce other domain specific services.

## Test mocks

In order to simplify testing the Redux app, we mock the Firebase interface. Currently this mock is not complete and only implements those functions that are used by the application. If you use a previously unused function you will need to add it to the mock in order to create tests. The `firebase` mock is implemented in `app/test/helpers/firebase.js` and is always loaded for unit tests.

Additionally the UI tests use a mock for the global `app` object which overrides the store and actions to make it simpler to test the Polymer elements without also testing the `app` behaviour. This means that if you use an action that was not previously used it will need to be added to the mock. The `app` mock is implemented in `ui/test/helpers/app.html` and is always loaded for unit tests.
