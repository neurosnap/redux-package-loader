import * as test from 'tape';
import { Module, Modules } from './types';
import use from './use';

const noop = () => {};

test('should combine all modules', (t) => {
  t.plan(1);

  const modOne = {
    actionTypes: {
      ONE: 'ONE',
    },
    actionCreators: {
      one: noop,
      two: noop,
    },
    effects: {
      sendOne: noop,
    },
  };

  const modTwo = {
    sagas: {
      onSendOne: noop,
    },
    actionTypes: {
      TWO: 'TWO',
      THREE: 'THREE',
    },
  };

  const modules: Modules = [
    modOne,
    modTwo,
  ];

  const actual = use(modules, { log: noop });
  const expected = {
    actionTypes: {
      ONE: 'ONE',
      TWO: 'TWO',
      THREE: 'THREE',
    },
    actionCreators: {
      one: noop,
      two: noop,
    },
    effects: {
      sendOne: noop,
    },
    sagas: {
      onSendOne: noop,
    },
    reducers: {},
    selectors: {},
  };

  t.deepEqual(actual, expected);
});

test('should combine all modules and add extras', (t) => {
  t.plan(1);

  const modOne = {
    actionTypes: {
      ONE: 'ONE',
    },
    actionCreators: {
      one: noop,
      two: noop,
    },
    effects: {
      sendOne: noop,
    },
    something: {
      four: noop,
    },
  };

  const modTwo = {
    sagas: {
      onSendOne: noop,
    },
    actionTypes: {
      TWO: 'TWO',
      THREE: 'THREE',
    },
    something: {
      five: noop,
    }
  };

  const modules: Modules = [
    modOne,
    modTwo,
  ];

  const actual = use(modules, { extra: ['something'], log: noop });
  const expected = {
    actionTypes: {
      ONE: 'ONE',
      TWO: 'TWO',
      THREE: 'THREE',
    },
    actionCreators: {
      one: noop,
      two: noop,
    },
    effects: {
      sendOne: noop,
    },
    sagas: {
      onSendOne: noop,
    },
    reducers: {},
    selectors: {},
    something: {
      four: noop,
      five: noop,
    },
  };

  t.deepEqual(actual, expected);
});
