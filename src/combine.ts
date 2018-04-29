import { Module, Modules } from './types';

const log = console.warn;

export default (modules: Modules = [], name: string = '') => {
  const merged: any = {};

  if (!name) {
    log('Must provide `combine` with a string, e.g. `reducers`, `sagas`');
    return merged;
  }

  modules.forEach((module: Module) => {
    if (!module.hasOwnProperty(name)) {
      return;
    }

    Object.keys(module[name]).forEach((key) => {
      if (merged.hasOwnProperty(key)) {
        log(`${name} ${key} already exists`);
        return;
      }

      merged[key] = module[name][key];
    });
  });

  if (['sagas', 'reducers'].includes(name) || !window.hasOwnProperty('Proxy')) {
    return merged;
  }

  const errorAlreadySent: { [key: string]: boolean } = {};
  return new Proxy(merged, {
    get: (target, prop) => {
      if (typeof prop === 'symbol') {
        return target[prop];
      }

      if (
        !target.hasOwnProperty(prop) &&
        !errorAlreadySent.hasOwnProperty(prop)
      ) {
        log(
          `Attempting to access non-existent property [${prop.toString()}] from [${name}]`,
        );
        errorAlreadySent[prop] = true;
        return undefined;
      }

      return target[prop];
    },
  });
}
