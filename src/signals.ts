type Getter<T> = () => T;
type Setter<T> = (value: T | ((previous: T) => T)) => void;
type Effect = () => void;

interface Dependencies {
  add: (effect: Effect) => void;
  delete: (effect: Effect) => void;
  notify: () => void;
}

function createSignalDependencies(): Dependencies {
  const dependencies = new Set<Effect>();
  return {
    add: (effect: Effect) => dependencies.add(effect),
    delete: (effect: Effect) => dependencies.delete(effect),
    notify: () => dependencies.forEach(effect => effect()),
  };
}

let currentEffect: Effect | null = null;
export function createSignal<T>(init: T): [Getter<T>, Setter<T>] {
  const dependencies = createSignalDependencies();

  let value = init;
  const read = () => {
    if (currentEffect) {
      dependencies.add(currentEffect);
    }
    return value;
  };

  const write = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      value = (newValue as (prev: T) => T)(value);
    }
    else {
      value = newValue;
    }
    dependencies.notify();
  };

  return [read, write];
}

export function createEffect(fn: Effect): Effect {
  const effect: Effect = () => {
    currentEffect = effect;
    try {
      fn();
    }
    finally {
      currentEffect = null;
    }
  };

  effect();
  return effect;
}
