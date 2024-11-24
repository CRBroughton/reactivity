import { expect, it, vi } from 'vitest';
import { createEffect, createSignal } from '../signals';

it('creates a signal with a starting value', () => {
  const [name] = createSignal('Craig');

  expect(name()).toStrictEqual('Craig');
});

it('modifies the inner value via the setter', () => {
  const [name, setName] = createSignal('Craig');
  setName('Bob');
  expect(name()).toStrictEqual('Bob');
});

it('modifies the inner value via the setter (Function)', () => {
  const [name, setName] = createSignal('Craig');
  setName(() => 'Bob');
  expect(name()).toStrictEqual('Bob');
});

it('effect runs immediately upon creation', () => {
  const fn = vi.fn();
  createEffect(fn);
  expect(fn).toHaveBeenCalledTimes(1);
});
it('effect runs when dependencies change', () => {
  const [count, setCount] = createSignal(0);
  const fn = vi.fn(() => count());

  createEffect(fn);
  expect(fn).toHaveBeenCalledTimes(1);

  setCount(1);
  expect(fn).toHaveBeenCalledTimes(2);
});

it('effect runs only when tracked dependencies change', () => {
  const [count1, setCount1] = createSignal(0);
  const [count2, setCount2] = createSignal(0);
  const fn = vi.fn(() => count1());

  createEffect(fn);
  expect(fn).toHaveBeenCalledTimes(1);

  setCount2(1); // Should not trigger effect
  expect(fn).toHaveBeenCalledTimes(1);

  setCount1(1); // Should trigger effect
  expect(fn).toHaveBeenCalledTimes(2);
});

it('effect tracks multiple dependencies', () => {
  const [first, setFirst] = createSignal('Hello');
  const [last, setLast] = createSignal('World');
  const fn = vi.fn(() => `${first()} ${last()}`);

  createEffect(fn);
  expect(fn).toHaveBeenCalledTimes(1);

  setFirst('Hi');
  expect(fn).toHaveBeenCalledTimes(2);

  setLast('Earth');
  expect(fn).toHaveBeenCalledTimes(3);
});
