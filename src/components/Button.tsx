/** @jsx createElement */

import { createElement } from '../dom';

export function Button(
  { text, click }:
  { text: string; click: (event: MouseEvent) => void },
) {
  return (
    <button
      class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
      onClick={click}
    >
      {text}
    </button>
  );
}
