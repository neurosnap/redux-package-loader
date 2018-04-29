import { ReducersMapObject } from 'redux';

import {
  Module,
  Modules,
  CombinedModules,
  ActionTypes,
  Functors,
  Gentors,
  UseOptions,
} from './types';
import _combine from './combine';

export default (
  modules: Modules = [],
  { extra = [], log }: UseOptions = {},
): CombinedModules => {
  const opts = { log };
  const combine = (modules: Modules, name: string) => _combine(modules, name, opts);

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
