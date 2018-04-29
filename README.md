# Redux Package Loader

Create a common interface for all features in a redux application

## Inspiration

Scaling a large react/redux application requires thought behind how multiple
features interact with each other.  Furthermore when there is a requirement
to target multiple platforms, it is critical to setup the folder, file organization
in such a way that every platform developed doesn't feel like a burden.

Tradition blueprints or starter packs that are transmitted across the internet
typically sets up applications by layer:

```bash
src/
    actions/
        login.js
        logout.js
        todo.js
    reducers/
        login.js
        logout.js
        todo.js
    selectors/
        login.js
        logout.js
        todo.js
    components/
        login.js
        logout.js
        todo.js
    sagas/
        auth.js
        todo.js
```

This works great for blueprints because it can help set up the scaffolding
without much customization required.  This does not work well when there are
50+ features and the developer is required to traverse multiple large folders.

Architecture should indicate function not implementation.  When building an
application, the top level source code should not look the same for every single
application.  The rails style MVC folder structure (layer-based) is not a good
approach to building an application.

Instead, the goal should be to build features in isolation of each other and then
compose those features to build an application.

Proposal:

```bash
packages/
    auth/
        action-creators.js
        action-types.js
        reducers.js
        selectors.js
        sagas.js
        index.js
    todo/
        action-creators.js
        action-types.js
        reducers.js
        selectors.js
        sagas.js
        index.js
    web-app/
        index.js
        packages.js
        store.js
        components/
            app.js
            todo.js
            login.js
            logout.js
```

These features can be built in isolation and then added to the application.
Another addition is the introduction of an `index.js` file.  This is important
because we want to create a common interface that all packages use to interact
with each other. For more information on why this is important see
[Jaysoo's Organizing Redux Application](https://jaysoo.ca/2016/02/28/organizing-redux-application/).

Each `index.js` file has the same exported object:

```js
import * as sagas from './sagas';
import * as reducers from './reducers';
import * as actionCreators from './action-creators';
import * as actionTypes from './action-types';
import * as selectors from './selectors';
import * as utils from './utils';
import * as components from './components';

export default {
    reducers,
    sagas,
    actionCreators,
    actionTypes,
    selectors,
    utils,
    components,
};
```

If a package does not have the same functionality as listed above, just don't
include them in the export.

This allows us to build tooling around each feature.  Furthermore with this setup
all we would need to do is add a `package.json` file and now we have packages
that could be published to npm.

We are also separating the view components from the core business logic of an application.
When building for multiple platforms it is important to share as much as possible
without being restricted by how other platforms are setup.  We can always import
`web-app` components into another platform, but it is not forced on us.

## How

Given the above folder structure and `index.js` file for each package,
we can now register them with our main application.

```js
// package.js
import { use, sagaCreator } from 'redux-package-loader';

const packages = use([
  require('../auth'),
  require('../todo'),
]); // `use` simply combines all package objects into one large object

const rootReducer = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

// then we export rootReducer and rootSaga so `createStore` can use them
export { packages, rootReducer, rootSaga };
```

```js
// store.js
export default ({ initState, rootReducer, rootSaga }) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  const store = createStore(
    rootReducer,
    initState,
    applyMiddleware(...middleware),
  );
  sagaMiddleware.run(rootSaga, hoodMap);

  return store;
};
```

```js
// index.js
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import createState from './store';
import { rootReducer, rootSaga } from './packages';
import App from './components/app';

const store = createState({ rootReducer, rootSaga });

render(
    <Provider store=store>
        <App />
    </Prodiver>,
    document.body,
);
```

## What to know

All objects from each package are combined into a single object:

```js
{
    reducers: {
        auth: () => {},
        todos: () => {},
    },
    sagas: {
        onLogin: () => {},
        onLogout: () => {},
        onAddTodo: () => {},
    },
    actionCreators: {
        login: () => {},
        logout: () => {},
        addTodo: () => {},
        removeTodo: () => {},
    },
    actionTypes: {
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT',
        ADD_TODO: 'ADD_TODO',
        REMOVE_TODO: 'REMOVE_TODO',
    },
}

Because of how this is setup, it is imperative to not add duplicate keys across
packages.  This library will warn you if that happens.
```
