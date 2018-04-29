import * as test from 'tape';
import { Module, Modules } from './types';
import combine from './combine';

const noop = (state: string = '', action: { type: any }): string => {
  return state;
};

test('should combine reducers key', (t) => {
  t.plan(1);

  const modOne: Module = {
    reducers: { test: noop, cool: noop },
  };
  const modTwo: Module = {
    reducers: { wow: noop },
  };

  const modules: Modules = [
    modOne,
    modTwo,
  ];

  const actual = combine(modules, 'reducers', { log: noop });
  const expected = {
    ...modOne.reducers,
    ...modTwo.reducers,
  };

  t.deepEqual(actual, expected);
});
