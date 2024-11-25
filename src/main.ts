import { createElement } from './dom';
import { createSignal } from './signals';
import './style.css';

function Counter() {
  const [count, setCount] = createSignal(0);

  const decrementBtn = createElement('button', {
    class: 'btn',
    text: '-',
    onclick: () => setCount(c => c - 1),
  });

  const display = createElement('span', {
    style: { margin: '0 16px', fontSize: '20px' },
    text: () => count().toString(),
  });

  const incrementBtn = createElement('button', {
    class: 'btn',
    text: '+',
    onclick: () => setCount(c => c + 1),
  });

  return createElement('div', {
    class: 'card',
    children: [decrementBtn, display, incrementBtn],
  });
}

function NameInput() {
  const [name, setName] = createSignal('');

  const input = createElement('input', {
    type: 'text',
    placeholder: 'Enter your name',
    style: {
      padding: '8px',
      marginRight: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    oninput: event => setName(event.target && event.target.value),
  });

  const greeting = createElement('div', {
    text: () => name() ? `Hello, ${name()}!` : '',
    style: { marginTop: '8px' },
  });

  return createElement('div', {
    class: 'card',
    children: [input, greeting],
  });
}

function App() {
  const title = createElement('h1', { text: 'Interactive Demo' });
  const description = createElement('p', {
    text: 'Try out these interactive components:',
  });

  const counterTitle = createElement('h2', { text: 'Counter' });
  const counter = Counter();

  const nameTitle = createElement('h2', { text: 'Name Input' });
  const nameInput = NameInput();

  return createElement('div', {
    class: 'container',
    children: [
      title,
      description,
      counterTitle,
      counter,
      nameTitle,
      nameInput,
    ],
  });
}

document.getElementById('app')?.appendChild(App());
