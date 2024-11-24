import { createEffect, createSignal } from './signals';
import typescriptLogo from './typescript.svg';
import './style.css';
import viteLogo from '/vite.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="decrement" type="button">-</button>
      <span id="count"></span>
      <button id="increment" type="button">+</button>
    </div>
    <div class="card">
      <input id="nameInput" type="text" placeholder="Enter your name">
      <div id="greeting"></div>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

const [count, setCount] = createSignal(0);
createEffect(() => {
  const countElement = document.querySelector('#count');
  if (countElement) {
    countElement.innerHTML = `Count is: ${count()}`;
  }
});

document.querySelector('#increment')?.addEventListener('click', () => {
  setCount(c => c + 1);
});
document.querySelector('#decrement')?.addEventListener('click', () => {
  setCount(c => c - 1);
});

const [name, setName] = createSignal('');
createEffect(() => {
  const greetingElement = document.querySelector('#greeting');
  if (greetingElement) {
    greetingElement.innerHTML = name()
      ? `Hello, ${name()}!`
      : 'Enter your name above';
  }
});
document.querySelector('#nameInput')?.addEventListener('input', (e) => {
  setName((e.target as HTMLInputElement).value);
});
