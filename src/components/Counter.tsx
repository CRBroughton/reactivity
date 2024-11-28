import { createElement } from '../dom';
import { createSignal } from '../signals';
import { Button } from './Button';

export function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800">Counter Demo</h2>
      <div class="text-4xl font-bold text-indigo-600">{count}</div>
      <div class="flex gap-2">
        <Button
          text="Decrement"
          click={() => setCount(count => count - 1)}
        >
          -
        </Button>
        <Button
          text="Increment"
          click={() => setCount(count => count + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}
