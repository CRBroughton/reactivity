import { expect, it, vi } from 'vitest';
import { createEffect, createMemo, createSignal } from '../signals';

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
  const [_count2, setCount2] = createSignal(0);
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

it('creates a memo with initial computation', () => {
  const [first] = createSignal('Hello');
  const [last] = createSignal('World');
  const fullName = createMemo(() => `${first()} ${last()}`);

  expect(fullName()).toBe('Hello World');
});

it('memo updates when dependencies change', () => {
  const [first, setFirst] = createSignal('Hello');
  const [last, setLast] = createSignal('World');
  const fullName = createMemo(() => `${first()} ${last()}`);

  expect(fullName()).toBe('Hello World');

  setFirst('Hi');
  expect(fullName()).toBe('Hi World');

  setLast('Earth');
  expect(fullName()).toBe('Hi Earth');
});

it('memo caches value and avoids recomputation', () => {
  const [count, setCount] = createSignal(0);
  const compute = vi.fn(x => x * 2);
  const doubled = createMemo(() => compute(count()));

  // Initial computation
  expect(doubled()).toBe(0);
  expect(compute).toHaveBeenCalledTimes(1);

  // Reading multiple times without changes
  doubled();
  doubled();
  doubled();
  expect(compute).toHaveBeenCalledTimes(1); // Still only one computation

  // Update triggers recomputation
  setCount(1);
  expect(doubled()).toBe(2);
  expect(compute).toHaveBeenCalledTimes(2);
});
