import { expect, test, vi } from 'vitest'
import { createSignal, createEffect } from '../signals'

test('Creates a signal with a starting value', () => {
  const [name] = createSignal('Craig')

  expect(name()).toStrictEqual('Craig')
})

test('Modifies the inner value via the setter', () => {
  const [name, setName] = createSignal('Craig')
  setName('Bob')
  expect(name()).toStrictEqual('Bob')
})

test('Modifies the inner value via the setter (Function)', () => {
  const [name, setName] = createSignal('Craig')
  setName(() => "Bob")
  expect(name()).toStrictEqual('Bob')
})

test('Effect runs immediately upon creation', () => {
  const fn = vi.fn()
  createEffect(fn)
  expect(fn).toHaveBeenCalledTimes(1)
})
test('Effect runs when dependencies change', () => {
  const [count, setCount] = createSignal(0)
  const fn = vi.fn(() => count())
  
  createEffect(fn)
  expect(fn).toHaveBeenCalledTimes(1)
  
  setCount(1)
  expect(fn).toHaveBeenCalledTimes(2)
})

test('Effect runs only when tracked dependencies change', () => {
  const [count1, setCount1] = createSignal(0)
  const [count2, setCount2] = createSignal(0)
  const fn = vi.fn(() => count1())
  
  createEffect(fn)
  expect(fn).toHaveBeenCalledTimes(1)
  
  setCount2(1) // Should not trigger effect
  expect(fn).toHaveBeenCalledTimes(1)
  
  setCount1(1) // Should trigger effect
  expect(fn).toHaveBeenCalledTimes(2)
})

test('Effect tracks multiple dependencies', () => {
  const [first, setFirst] = createSignal('Hello')
  const [last, setLast] = createSignal('World')
  const fn = vi.fn(() => `${first()} ${last()}`)
  
  createEffect(fn)
  expect(fn).toHaveBeenCalledTimes(1)
  
  setFirst('Hi')
  expect(fn).toHaveBeenCalledTimes(2)
  
  setLast('Earth')
  expect(fn).toHaveBeenCalledTimes(3)
})