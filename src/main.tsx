import { Counter } from './components/Counter';
import { Input } from './components/Input';
import { createElement, render } from './dom';
import { createSignal } from './signals';

import './index.css';

function App() {
  const [text, setText] = createSignal('');

  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-md mx-auto space-y-8">
        <Counter />

        <div class="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">Input Demo</h2>

          <Input
            label="Text Input"
            value={text()}
            onChange={setText}
            placeholder="Type something..."
          />
          <div class="text-gray-600">
            You typed:
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app')!);
