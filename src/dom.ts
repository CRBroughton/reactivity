import type { Component, JSXElement, Props, VNode } from './jsx';
import { createEffect } from './signals';

export function createElement(type: string | Component, props: Props | null, ...children: VNode[]): JSXElement {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
}

function isJSXElement(node: VNode | JSXElement): node is JSXElement {
  return typeof node === 'object' && node !== null && 'type' in node && 'props' in node && 'children' in node;
}
function createComponent(jsxElement: JSXElement): HTMLElement | Text {
  if (typeof jsxElement.type === 'string') {
    const element = document.createElement(jsxElement.type);

    Object.entries(jsxElement.props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.toLowerCase().slice(2), value as EventListener);
      }
      else {
        element.setAttribute(key, String(value));
      }
    });

    jsxElement.children.forEach((child) => {
      if (child == null)
        return;
      if (typeof child === 'function') {
        const textNode = document.createTextNode('');
        createEffect(() => {
          textNode.textContent = String(child());
        });
        element.appendChild(textNode);
      }
      else if (isJSXElement(child)) {
        element.appendChild(createComponent(child));
      }
      else {
        element.appendChild(document.createTextNode(String(child)));
      }
    });

    return element;
  }
  else {
    const result = jsxElement.type({ ...jsxElement.props, children: jsxElement.children });
    return createComponent(result);
  }
}

export function render(component: JSXElement, container: HTMLElement | null) {
  if (!container)
    throw new Error('Container element not found');
  container.appendChild(createComponent(component));
}
