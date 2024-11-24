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

it('creates a signal with an array value', () => {
  const [items] = createSignal(['a', 'b', 'c']);
  expect(items()).toEqual(['a', 'b', 'c']);
});

it('adds items to array', () => {
  const [items, setItems] = createSignal<string[]>([]);
  setItems(prev => [...prev, 'new item']);
  expect(items()).toEqual(['new item']);
});

it('effects track array changes', () => {
  const [items, setItems] = createSignal<string[]>([]);
  const effectFn = vi.fn();

  createEffect(() => {
    items(); // Subscribe to changes
    effectFn();
  });

  expect(effectFn).toHaveBeenCalledTimes(1);

  setItems(['new item']);
  expect(effectFn).toHaveBeenCalledTimes(2);
  expect(items()).toEqual(['new item']);
});

it('supports array methods through setter function', () => {
  const [items, setItems] = createSignal<string[]>(['a', 'b', 'c']);

  // Push equivalent
  setItems(prev => [...prev, 'd']);
  expect(items()).toEqual(['a', 'b', 'c', 'd']);

  // Filter equivalent
  setItems(prev => prev.filter(item => item !== 'b'));
  expect(items()).toEqual(['a', 'c', 'd']);

  // Map equivalent
  setItems(prev => prev.map(item => item.toUpperCase()));
  expect(items()).toEqual(['A', 'C', 'D']);
});

it('effect updates when array length changes', () => {
  const [items, setItems] = createSignal<string[]>([]);
  const lengthFn = vi.fn();

  createEffect(() => {
    lengthFn(items().length);
  });

  expect(lengthFn).toHaveBeenLastCalledWith(0);

  setItems(['item 1']);
  expect(lengthFn).toHaveBeenLastCalledWith(1);

  setItems(prev => [...prev, 'item 2']);
  expect(lengthFn).toHaveBeenLastCalledWith(2);
});

it('effect updates when array items change', () => {
  const [items, setItems] = createSignal<string[]>(['original']);
  const effectFn = vi.fn();

  createEffect(() => {
    items().forEach(item => effectFn(item));
  });

  expect(effectFn).toHaveBeenLastCalledWith('original');

  setItems(['updated']);
  expect(effectFn).toHaveBeenLastCalledWith('updated');
});

it('multiple array operations in sequence', () => {
  const [items, setItems] = createSignal<string[]>([]);
  const effectFn = vi.fn();

  createEffect(() => {
    effectFn(items().length);
  });

  // Add items
  setItems(prev => [...prev, 'item 1']);
  setItems(prev => [...prev, 'item 2']);
  expect(items()).toEqual(['item 1', 'item 2']);
  expect(effectFn).toHaveBeenLastCalledWith(2);

  // Remove an item
  setItems(prev => prev.filter(item => item !== 'item 1'));
  expect(items()).toEqual(['item 2']);
  expect(effectFn).toHaveBeenLastCalledWith(1);

  // Clear array
  setItems([]);
  expect(items()).toEqual([]);
  expect(effectFn).toHaveBeenLastCalledWith(0);
});

it('array spread operations', () => {
  const [items, setItems] = createSignal<string[]>(['a', 'b']);
  const [items2] = createSignal<string[]>(['c', 'd']);

  setItems(prev => [...prev, ...items2()]);
  expect(items()).toEqual(['a', 'b', 'c', 'd']);
});

it('complex array operations with objects', () => {
  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }

  const [todos, setTodos] = createSignal<Todo[]>([]);

  // Add todo
  setTodos(prev => [...prev, { id: 1, text: 'Test', completed: false }]);
  expect(todos()).toHaveLength(1);
  expect(todos()[0]).toEqual({ id: 1, text: 'Test', completed: false });

  // Update todo
  setTodos(prev =>
    prev.map(todo =>
      todo.id === 1 ? { ...todo, completed: true } : todo,
    ),
  );
  expect(todos()[0].completed).toBe(true);

  // Remove todo
  setTodos(prev => prev.filter(todo => todo.id !== 1));
  expect(todos()).toHaveLength(0);
});

it('array mutations trigger effects exactly once', () => {
  const [items, setItems] = createSignal<string[]>([]);
  const effectFn = vi.fn();

  createEffect(() => {
    items(); // Subscribe to changes
    effectFn();
  });

  expect(effectFn).toHaveBeenCalledTimes(1);

  setItems((prev) => {
    prev.push('item 1'); // Don't do this in real code!
    prev.push('item 2'); // Multiple mutations
    return prev;
  });

  // Should still only trigger once
  expect(effectFn).toHaveBeenCalledTimes(2);
});
