import { Module, Modules, CombineOptions } from './types';

const defaultLog = console.warn;

export default (
  modules: Modules = [],
  name: string = '',
  { log = defaultLog }: CombineOptions = {},
) => {
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

  if (['sagas', 'reducers'].includes(name)) {
    return merged;
  }

  const hasWindow = typeof window === undefined;
  if (hasWindow && !window.hasOwnProperty('Proxy')) {
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
