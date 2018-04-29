import { ReducersMapObject } from 'redux';

import {
  Module,
  Modules,
  CombinedModules,
  ActionTypes,
  Functors,
  Gentors,
} from './types';
import combine from './combine';

const log = console.warn;

export default (modules: Modules = [], extra: string[] = []): CombinedModules => {
  const reducers: ReducersMapObject = combine(modules, 'reducers');
  const actionTypes: ActionTypes = combine(modules, 'actionTypes');
  const actionCreators: Functors = combine(modules, 'actionCreators');
  const sagas: Gentors = combine(modules, 'sagas');
  const effects: Gentors = combine(modules, 'effects');
  const selectors: Functors = combine(modules, 'selectors');
  const extras = extra.reduce(
    (acc, name) => ({ ...acc, [name]: combine(modules, name) }),
    {},
  );

  return {
    reducers,
    actionTypes,
    actionCreators,
    sagas,
    selectors,
    effects,
    ...extras,
  };
};
