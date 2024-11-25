import { createEffect } from './signals';

type Props = Record<string, unknown>;
interface VNode {
  type: string;
  props: Props;
  children: Children;
}
type Children = (VNode | string)[];

// TODO - Try to implement some sort of VDOM
// function html(type: string, props: Props = {}, ...children: Children): VNode {
//   return {
//     type,
//     props,
//     children: children.flat(),
//   };
// }

// function text(content: string): string {
//   return content;
// }

type Style = Partial<CSSStyleDeclaration | Record<string, PropertyKey>>;

type EventHandlers = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]?: (event: HTMLElementEventMap[K]) => void;
};

export interface ElementProps extends EventHandlers {
  style?: Style;
  class?: string;
  className?: string;
  text?: string | (() => string);
  children?: (HTMLElement | null | undefined)[];
  [key: string]: any;
};

export function createElement(tag: string, props: ElementProps = {}) {
  const element = document.createElement(tag);

  const { style, class: className, text, children, ...otherProps } = props;

  if (className)
    element.className = className;

  if (style)
    Object.assign(element.style, style);

  if (text) {
    if (typeof text === 'function') {
      createEffect(() => {
        element.textContent = text();
      });
    }
    else {
      element.textContent = text;
    }
  }

  Object.entries(otherProps).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    }
    else {
      element.setAttribute(key, value);
    }
  });

  if (children) {
    children.forEach((child) => {
      if (child instanceof Node)
        element.appendChild(child);
    });
  }

  return element;
}
