/** @jsx createElement */

import { createElement } from '../dom';
import { createSignal } from '../signals';

export function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800">Counter Demo</h2>
      <div class="text-4xl font-bold text-indigo-600">{count}</div>
      <div class="flex gap-2">
        <button
          onClick={() => setCount(count => count - 1)}
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => setCount(count => count + 1)}
          class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
